const express = require('express');
const mongoose = require('mongoose');
const tokenValidatorMiddleware = require("../../middleware/auth/tokenValidator");
const userAuthMiddleware = require("../../middleware/auth/userValidator");
const router = express.Router();

// Define and export models here so child routes can reuse them
let Chat;
try { Chat = mongoose.model('Chat'); } catch (e) {
    const ChatSchema = new mongoose.Schema({
        buyerID: { type: String, required: true },
        sellerID: { type: String, required: true },
        associatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        deletedBy: { type: [String], default: [] },
        createdAt: { type: Date, default: Date.now }
    });
    Chat = mongoose.model('Chat', ChatSchema);
}

let Message;
try { Message = mongoose.model('Message'); } catch (e) {
    const MessageSchema = new mongoose.Schema({
        chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
        senderId: { type: String, required: true },
        content: { type: String },
        attachments: [{ url: String, filename: String, mimeType: String }],
        readBy: { type: [String], default: [] },
    }, { timestamps: true });
    Message = mongoose.model('Message', MessageSchema);
}

// Now require child routes so they can access the models defined above
const getChats = require('./getChats');
const getMessages = require('./getMsg');

router.use(tokenValidatorMiddleware)
router.use(userAuthMiddleware)
router.use('/', getChats)
router.use('/', getMessages)

module.exports = router;