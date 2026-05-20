const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Reuse centralized chat models
const { Chat, Message } = require('./models');

// POST /:chatId/messages/polling
router.post('/:chatId/messages/polling', async (req, res) => {
    const chatId = req.params.chatId;
    const { content, attachments } = req.body || {};
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        if (!uid) return res.status(401).json({ error: 'Unauthorized' });
        const isParticipant = String(chat.buyerID) === String(uid) || String(chat.sellerID) === String(uid);
        if (!isParticipant) return res.status(403).json({ error: 'Not a participant of this conversation' });

        if ((!content || content.trim().length === 0) && (!attachments || attachments.length === 0)) {
            return res.status(400).json({ error: 'Empty message' });
        }

        const newMessage = await new Message({
            chatId: chatId,
            senderId: uid,
            content: content,
            attachments: Array.isArray(attachments) ? attachments : [],
            // mark as read by the sender
            readBy: [uid]
        }).save();

        const messageToReturn = {
            id: newMessage._id,
            content: newMessage.content,
            senderId: newMessage.senderId,
            createdAt: newMessage.createdAt,
            // for the requester, this will be true (sender)
            isRead: Array.isArray(newMessage.readBy) && newMessage.readBy.includes(uid),
            chatId: newMessage.chatId
        };

        return res.status(201).json({ message: messageToReturn });
    } catch (e) {
        console.error('polling POST error', e);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /:chatId/messages/polling?lastCheckedAt=<ISO>
router.get('/:chatId/messages/polling', async (req, res) => {
    const chatId = req.params.chatId;
    const { lastCheckedAt } = req.query;
    if (!lastCheckedAt) return res.status(400).json({ error: 'Missing lastCheckedAt query parameter' });
    const since = new Date(lastCheckedAt);
    if (isNaN(since.getTime())) return res.status(400).json({ error: 'Invalid lastCheckedAt' });
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        if (!uid) return res.status(401).json({ error: 'Unauthorized' });
        const isParticipant = String(chat.buyerID) === String(uid) || String(chat.sellerID) === String(uid);
        if (!isParticipant) return res.status(403).json({ error: 'Not a participant of this conversation' });

        let messages = await Message.find({ chatId: chatId, createdAt: { $gt: since } }).sort({ createdAt: 1 }).lean();

        const idsToMark = messages.filter(m => String(m.senderId) !== String(uid) && !(Array.isArray(m.readBy) && m.readBy.includes(uid))).map(m => m._id);
        if (idsToMark.length > 0) {
            await Message.updateMany({ _id: { $in: idsToMark } }, { $addToSet: { readBy: uid } });
            // reflect change in returned objects
            messages = messages.map(m => idsToMark.find(id => String(id) === String(m._id)) ? Object.assign(m, { isRead: true }) : m);
        }
        // Create notification for recipient (fire-and-forget)
        try {
            const recipientId = String(chat.buyerID) === String(uid) ? String(chat.sellerID) : String(chat.buyerID);
            if (recipientId && String(recipientId) !== String(uid)) {
                const user = await db.findUserByUID(String(uid))
                const notif = {
                    userID: recipientId,
                    type: 'message',
                    title: (user && user.username)? 'Nuevo mensaje de '+user.username : 'Nuevo mensaje',
                    message: (newMessage.content && String(newMessage.content).substring(0, 200)) || 'Adjunto enviado',
                    topicID: messageToSend.id
                };
                createNotification(notif).catch(err => console.error('createNotification error', err));
            }
        } catch (e) {
            console.error('notification error', e);
        }
        return res.json({ messages });
    } catch (e) {
        console.error('polling GET error', e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
