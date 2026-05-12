const express = require('express');
const mongoose = require('mongoose');
const DbManager = require('./dbManager');

const router = express.Router();

// 1. Conexión a MongoDB (mongoose is used for chat/message models)
// TODO: Integrate into dbManager
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');

const ChatSchema = new mongoose.Schema({
    buyerID: { type: String, required: true },
    sellerID: { type: String, required: true },
    associatedProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    createdAt: { type: Date, default: Date.now }
});
const Chat = mongoose.model('Chat', ChatSchema);

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    senderId: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 3. Middleware de Autenticación — use existing validators
const tokenValidator = require('./middleware/auth/tokenValidator');
const userValidator = require('./middleware/auth/userValidator');

// Compose tokenValidator -> userValidator and attach `req.user.id` from token payload
const authMiddleware = (req, res, next) => {
    tokenValidator(req, res, function () {
        if (res.headersSent) return;
        // userValidator may be async; call and let it call its next
        userValidator(req, res, function () {
            if (res.headersSent) return;
            const UID = req.token && req.token.payload && req.token.payload.UID;
            req.user = { id: UID };
            next();
        });
    });
};

// 4. RUTAS DEL TIQUET

// POST /api/chat/ - Iniciar nuevo chat
router.post('/api/chat/', authMiddleware, async (req, res) => {
    const { productID } = req.body;
    const buyerID = req.user.id;

    try {
        // A. Verificar que el productID exista
        const product = await DbManager.findProductByID(productID);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const sellerID = product.sellerID;

        // Validación extra: No chatear con uno mismo
        if (buyerID === sellerID) {
            return res.status(400).json({ error: "No puedes iniciar chat con tu propio producto" });
        }

        // B. Verificar que no exista ya un chat para este producto entre ellos
        const existingChat = await Chat.findOne({
            associatedProduct: productID,
            buyerID: buyerID,
            sellerID: sellerID
        });

        if (existingChat) {
            return res.status(409).json({ error: "This chat already exists" });
        }

        // C. Crear nuevo chat
        const newChat = new Chat({
            buyerID: buyerID,
            sellerID: sellerID,
            associatedProduct: productID
        });

        await newChat.save();
        res.status(201).json({ message: "Chat created.", chatId: newChat._id });

    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// GET /api/messages/:chatId - Obtener mensajes
router.get('/api/messages/:chatId', async (req, res) => {
    const messages = await Message.find({ chatId: req.params.chatId }).sort('timestamp');
    res.json(messages);
});

// POST /api/messages - Enviar mensaje
router.post('/api/messages', authMiddleware, async (req, res) => {
    const { chatId, text } = req.body;
    const newMessage = await new Message({ 
        chatId, 
        senderId: req.user.id, 
        text 
    }).save();
    res.status(201).json(newMessage);
});

module.exports = router;