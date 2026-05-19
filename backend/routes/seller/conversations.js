const express = require('express');
const router = express.Router();
const DbManager = require('../../dbManager');
const mongoose = require('mongoose');

// Reuse existing Chat model if defined, otherwise define it
let Chat;
try {
    Chat = mongoose.model('Chat');
} catch (e) {
    const ChatSchema = new mongoose.Schema({
        buyerID: { type: String, required: true },
        sellerID: { type: String, required: true },
        associatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        deletedBy: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now }
    });
    Chat = mongoose.model('Chat', ChatSchema);
}

// POST /api/seller/chat
// Body: { saleID }
router.post('/', async (req, res) => {
    const { saleID } = req.body || {};
    const sellerUID = req.token && req.token.payload && req.token.payload.UID;

    if (!saleID) return res.status(400).json({ error: 'Missing saleID' });
    try {
        const sale = await DbManager.findOrderByID(saleID);
        if (!sale) return res.status(404).json({ error: 'Sale not found' });

        if (String(sale.sellerID) !== String(sellerUID)) return res.status(403).json({ error: 'You are not the seller for this sale' });

        const buyerID = sale.buyerID;
        const productID = sale.productID;

        if (!buyerID || !productID) return res.status(400).json({ error: 'Invalid sale data' });

        // Prevent starting conversation with yourself
        if (String(buyerID) === String(sellerUID)) return res.status(400).json({ error: 'Cannot start conversation with yourself' });

        // Prevent duplicate conversation for same product between same buyer and seller
        const existing = await Chat.findOne({ associatedProduct: productID, buyerID: buyerID, sellerID: sellerUID });
        if (existing) return res.status(409).json({ error: 'Conversation already exists' });

        const newConv = new Chat({ buyerID, sellerID: sellerUID, associatedProduct: productID });
        await newConv.save();
        return res.status(201).json({ chatId: newConv._id });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
