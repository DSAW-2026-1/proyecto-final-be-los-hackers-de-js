const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { Chat, Message } = require('./models');

// New route: POST /:chatId/messages (mounted at /api/chat)
router.post('/:chatId/messages', async (req, res) => {
    const chatId = req.params.chatId;
    const { content, attachments, tempId } = req.body || {};

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        const isParticipant = String(chat.buyerID) === String(uid) || String(chat.sellerID) === String(uid);
        if (!isParticipant) return res.status(403).json({ error: 'Not a participant of this chat' });

        if ((!content || content.trim().length === 0) && (!attachments || attachments.length === 0)) {
            return res.status(400).json({ error: 'Empty message' });
        }

        const newMessage = await new Message({
            chatId,
            senderId: uid,
            content: content,
            attachments: Array.isArray(attachments) ? attachments : [],
            // mark as read by the sender
            readBy: [uid]
        }).save();

        // normalize response to match websocket message shape and echo tempId if provided
        const messageToSend = {
            id: String(newMessage._id),
            content: newMessage.content,
            senderId: String(newMessage.senderId),
            createdAt: newMessage.createdAt,
            readBy: newMessage.readBy,
            chatId: String(newMessage.chatId)
        };
        if (typeof tempId !== 'undefined' && tempId !== null) messageToSend.tempId = tempId;

        return res.status(201).json(messageToSend);
    } catch (e) {
        return res.status(500).json({ error: 'Error saving message' });
    }
});

module.exports = router;
