const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { Chat, Message } = require('./models');

// POST /:chatId/messages/mark_read
router.post('/:chatId/messages/mark_read', async (req, res) => {
    const chatId = req.params.chatId;
    const { messageIds, before } = req.body || {};
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        if (chat.buyerID !== uid && chat.sellerID !== uid) return res.status(403).json({ error: 'Not a participant' });

        const filter = { chatId: chatId, senderId: { $ne: uid } };
        if (Array.isArray(messageIds) && messageIds.length > 0) {
            filter._id = { $in: messageIds };
        } else if (before) {
            const beforeDate = new Date(before);
            if (isNaN(beforeDate.getTime())) return res.status(400).json({ error: 'Invalid before timestamp' });
            filter.createdAt = { $lte: beforeDate };
        }
        // Only mark messages not yet read by this user
        filter.readBy = { $ne: uid };

        const result = await Message.updateMany(filter, { $addToSet: { readBy: uid } });
        return res.json({ ok: true, modifiedCount: result.nModified || result.modifiedCount || 0 });
    } catch (e) {
        console.error('mark_read error', e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
