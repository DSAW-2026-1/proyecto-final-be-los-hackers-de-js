const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const DbManager = require('./dbManager');
const { Chat, Message } = require('./routes/chat/models');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

module.exports = function attach(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true
        }
    });

    // Auth middleware for sockets
    io.use(async (socket, next) => {
        try {
            const token = (socket.handshake.auth && socket.handshake.auth.token) || socket.handshake.query.token;
            if (!token) return next(new Error('Authentication error: no token'));
            const payload = jwt.verify(token, JWT_SECRET);
            if (!payload || !payload.UID) return next(new Error('Authentication error: invalid token'));
            const user = await DbManager.findUserByUID(payload.UID);
            if (!user) return next(new Error('Authentication error: invalid user'));
            socket.user = { id: payload.UID };
            next();
        } catch (e) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        const uid = socket.user.id;
        // join room by user id
        socket.join(uid);

        // Emit unread messages count when user connects
        try {
            // Find chats involving user
            const chats = await Chat.find({ $or: [{ buyerID: uid }, { sellerID: uid }] }).select('_id').lean();
            const chatIds = chats.map(c => c._id);
            // count messages where the requester is not the sender and hasn't read them yet
            const unreadCount = await Message.countDocuments({ chatId: { $in: chatIds }, senderId: { $ne: uid }, readBy: { $ne: uid } });
            socket.emit('unread_messages', { unreadCount });
        } catch (e) {
            // ignore errors here
            console.error('Error emitting unread_messages', e);
        }

        socket.on('send_message', async (payload, ack) => {
            // payload: { chatId, content, attachments }
            try {
                const { chatId, content, attachments } = payload || {};
                if (!chatId) return ack && ack({ error: 'Missing chatId' });
                const chat = await Chat.findById(chatId);
                if (!chat) return ack && ack({ error: 'Chat not found' });
                if (chat.buyerID !== uid && chat.sellerID !== uid) return ack && ack({ error: 'Not a participant' });
                if ((!content || content.trim().length === 0) && (!attachments || attachments.length === 0)) return ack && ack({ error: 'Empty message' });

                const newMessage = await new Message({
                    chatId,
                    senderId: uid,
                    content: content,
                    attachments: Array.isArray(attachments) ? attachments : [],
                    // mark as read by sender
                    readBy: [uid]
                }).save();

                const messageToSend = {
                    id: newMessage._id,
                    content: newMessage.content,
                    senderId: newMessage.senderId,
                    createdAt: newMessage.createdAt,
                    // expose readBy so clients can compute per-user isRead; consider not exposing in future
                    readBy: newMessage.readBy,
                    chatId: newMessage.chatId
                };

                // emit to both participants
                try {
                    io.to(chat.buyerID).emit('receive_message', messageToSend);
                    io.to(chat.sellerID).emit('receive_message', messageToSend);
                } catch (e) {
                    console.error('Error emitting receive_message', e);
                }

                ack && ack({ ok: true, message: messageToSend });
            } catch (e) {
                console.error('send_message error', e);
                ack && ack({ error: 'Server error' });
            }
        });

        socket.on('message_read', async (payload, ack) => {
            // payload: { chatId, messageIds, before }
            try {
                const { chatId, messageIds, before } = payload || {};
                if (!chatId) return ack && ack({ error: 'Missing chatId' });
                const chat = await Chat.findById(chatId);
                if (!chat) return ack && ack({ error: 'Conversation not found' });
                if (chat.buyerID !== uid && chat.sellerID !== uid) return ack && ack({ error: 'Not a participant' });

                const filter = { chatId: chatId, senderId: { $ne: uid } };
                if (Array.isArray(messageIds) && messageIds.length > 0) {
                    filter._id = { $in: messageIds };
                } else if (before) {
                    const beforeDate = new Date(before);
                    if (isNaN(beforeDate.getTime())) return ack && ack({ error: 'Invalid before timestamp' });
                    filter.createdAt = { $lte: beforeDate };
                }
                filter.readBy = { $ne: uid };

                const result = await Message.updateMany(filter, { $addToSet: { readBy: uid } });
                const payloadOut = { chatId, messageIds: messageIds || null, modifiedCount: result.nModified || result.modifiedCount || 0, readerId: uid };
                try {
                    io.to(chat.buyerID).emit('messages_marked_read', payloadOut);
                    io.to(chat.sellerID).emit('messages_marked_read', payloadOut);
                } catch (e) { }

                ack && ack({ ok: true, modifiedCount: result.nModified || result.modifiedCount || 0 });
            } catch (e) {
                console.error('message_read error', e);
                ack && ack({ error: 'Server error' });
            }
        });

        socket.on('disconnect', (reason) => {
            // cleanup if needed
        });
    });

    console.log('Socket.io attached');
};
