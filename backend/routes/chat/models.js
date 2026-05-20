const mongoose = require('mongoose');

// Centralized Chat and Message model definitions — single source of truth
let Chat = mongoose.models.Chat;
if (!Chat) {
  const ChatSchema = new mongoose.Schema({
    buyerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    associatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    deletedBy: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
  });
  Chat = mongoose.model('Chat', ChatSchema);
}

let Message = mongoose.models.Message;
if (!Message) {
  const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: String, required: true },
    content: { type: String },
    attachments: [{ url: String, filename: String, mimeType: String }],
    readBy: { type: [String], default: [] },
  }, { timestamps: true });

  Message = mongoose.model('Message', MessageSchema);
}

module.exports = { Chat, Message };
