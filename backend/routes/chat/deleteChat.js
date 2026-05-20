const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { Chat } = require('./models');

// DELETE /api/chat/:chatId - soft-delete by adding userId to deletedBy array
router.delete('/:chatId', async (req, res) => {
    const { chatId } = req.params;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ error: 'Conversation not found' });
        const uid = req.token && req.token.payload && req.token.payload.UID;
        if (chat.buyerID !== uid && chat.sellerID !== uid) return res.status(403).json({ error: 'Not a participant' });
        if (!Array.isArray(chat.deletedBy)) chat.deletedBy = [];
        if (!chat.deletedBy.includes(uid)) {
            chat.deletedBy.push(uid);
            await chat.save();
        }
        return res.status(204).send();
    } catch (e) { return res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
