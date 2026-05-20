const express = require('express');
//TODO: Handle chats with dbManager instead of mongoose
const mongoose = require('mongoose');

const router = express.Router();

const { Chat, Message } = require('./models');

// GET /:chatId/messages - paginated. Authentication middleware is applied in parent router (chat.js)
router.get('/:chatId/messages', async (req, res) => {
    const chatId = req.params.chatId;
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 50;
    if (isNaN(offset) || offset < 0) offset = 0;

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        if (!uid) return res.status(400).json({ error: 'Missing user identity' });
        if (chat.buyerID !== uid && chat.sellerID !== uid) return res.status(403).json({ error: 'Not a participant of this conversation' });

        const total = await Message.countDocuments({ chatId: chatId });
        const messages = await Message.find({ chatId: chatId })
            .sort({ createdAt: 1 })
            .skip(offset)
            .limit(limit)
            .lean();

        const messagesWithRead = messages.map(m => {
            const isRead = Array.isArray(m.readBy) && m.readBy.includes(uid);
            const { readBy, ...rest } = m;
            return Object.assign(rest, { isRead });
        });

        return res.json({ messages: messagesWithRead, meta: { limit, offset, total } });
    } catch (e) {
        console.error('get messages error', e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;