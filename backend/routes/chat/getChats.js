const express = require('express');
//TODO: Handle with dbManager instead of mongoose
const mongoose = require('mongoose');
const DbManager = require('../../dbManager');

const router = express.Router();

const { Chat, Message } = require('./models');

// GET /my - get user's conversations excluding those soft-deleted by the current user
router.get('/my', async (req, res) => {
    const uid = req.token && req.token.payload && req.token.payload.UID;
    let limit = parseInt(req.query.limit, 10);
    let offset = parseInt(req.query.offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 50;
    if (isNaN(offset) || offset < 0) offset = 0;

    try {
        const matchQuery = {
            $and: [
                { $or: [{ buyerID: uid }, { sellerID: uid }] },
                { deletedBy: { $ne: uid } }
            ]
        };

        const total = await Chat.countDocuments(matchQuery);

        // Fetch chats and enrich each with last message, product and other user.
        const chats = await Chat.find(matchQuery).sort({ createdAt: -1 }).skip(offset).limit(limit).lean();

        const conversations = await Promise.all(chats.map(async (c) => {
            const chatId = c._id;
            const lastMessage = await Message.findOne({ chatId }).sort({ createdAt: -1 }).lean();
            const product = await DbManager.findProductByID(c.associatedProduct);
            const otherUserId = (String(c.buyerID) === String(uid)) ? c.sellerID : c.buyerID;
            const otherUser = await DbManager.findUserByUID(otherUserId).catch(() => null);

            return {
                id: c._id,
                buyerID: c.buyerID,
                sellerID: c.sellerID,
                associatedProduct: c.associatedProduct,
                updatedAt: lastMessage?.createdAt || c.createdAt,
                otherUser: otherUser ? { name: otherUser.username, photo: otherUser.photo, reputation: otherUser.reputation } : null,
                product: product ? { title: product.name, image: Array.isArray(product.images) ? product.images[0] : (product.images || null) } : null,
                lastMessage: lastMessage ? { content: lastMessage.content, senderId: lastMessage.senderId, createdAt: lastMessage.createdAt, isRead: Array.isArray(lastMessage.readBy) && lastMessage.readBy.includes(uid) } : null
            };
        }));

        return res.json({ conversations, meta: { total, limit, offset } });
    } catch (e) {
        console.error('get chats error', e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
