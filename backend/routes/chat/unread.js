const express = require('express');
const router = express.Router();

const { Chat, Message } = require('./models');

// GET /unread - returns total unread and per-chat unread counts for authenticated user
router.get('/unread', async (req, res) => {
  const uid = req.token && req.token.payload && req.token.payload.UID;
  if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const chats = await Chat.find({ $or: [{ buyerID: uid }, { sellerID: uid }] }).select('_id').lean();
    const chatIds = (Array.isArray(chats) && chats.length) ? chats.map(c => c._id) : [];

    if (!chatIds.length) return res.json({ total: 0, perChat: [] });

    const agg = await Message.aggregate([
      { $match: { chatId: { $in: chatIds }, senderId: { $ne: uid }, readBy: { $ne: uid } } },
      { $group: { _id: "$chatId", count: { $sum: 1 } } }
    ]);

    const perChat = agg.map(a => ({ chatId: String(a._id), unreadCount: a.count }));
    const total = perChat.reduce((s, p) => s + p.unreadCount, 0);

    return res.json({ total, perChat });
  } catch (e) {
    console.error('get unread counts error', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
