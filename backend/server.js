//TODO: Standardize all the routes here to use dbManager and be organized properly like the rest of them
const express = require('express');
const mongoose = require('mongoose');
const DbManager = require('./dbManager');

const router = express.Router();

// 1. Conexión a MongoDB (mongoose is used for chat/message models)
// TODO: Integrate into dbManager
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');

const { Chat, Message } = require('./routes/chat/models');

// Message model and schema moved to backend/models/message.js

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
            console.log("Product "+productID+" not found")
            return res.status(404).json({ error: "Product not found" });
        }

        const sellerID = product.sellerID;

        // Validación extra: No chatear con uno mismo
        if (buyerID === sellerID) {
            return res.status(400).json({ error: "Cannot start conversation with your own product" });
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

// legacy POST /api/chat removed; use POST /api/chat/ instead
// NOTE: This handler was removed to avoid duplicate route handlers. Use the existing POST /api/chat/ endpoint.

// GET /api/messages/:chatId - Obtener mensajes (legacy)
// Moved to backend/routes/chat/legacyMessages.js and mounted relative to /api/chat as /api/chat/messages/:chatId


// Route moved to backend/routes/chat/getMsg.js (handled by routes/chat/chat.js)


// POST /api/messages/:chatId - moved to backend/routes/chat/postMessage.js

// Polling endpoints moved to backend/routes/chat/polling.js



// Route moved to backend/routes/chat/getChats.js (handled by routes/chat/chat.js)
// POST /api/chat/:chatId/messages/mark_read moved to backend/routes/chat/markRead.js

// DELETE /api/chat/:chatId moved to backend/routes/chat/deleteChat.js

module.exports = router;
