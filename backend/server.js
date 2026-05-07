const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/marketplace-chat');

// 2. Modelos Actualizados (Según el nuevo tiquet)
const ProductSchema = new mongoose.Schema({
    name: String,
    sellerID: String, // UID del vendedor
    price: Number
});
const Product = mongoose.model('Product', ProductSchema);

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

// 3. Middleware de Autenticación (Simulado)
// IMPORTANTE: Para las pruebas, envía un header 'user-id' con el ID del comprador
const authMiddleware = (req, res, next) => {
    const userId = req.headers['user-id']; 
    if (!userId) return res.status(401).json({ error: "No autorizado. Falta user-id en headers." });
    req.user = { id: userId };
    next();
};

// 4. RUTAS DEL TIQUET

// POST /api/chat/ - Iniciar nuevo chat
app.post('/api/chat/', authMiddleware, async (req, res) => {
    const { productID } = req.body;
    const buyerID = req.user.id;

    try {
        // A. Verificar que el productID exista
        const product = await Product.findById(productID);
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
app.get('/api/messages/:chatId', async (req, res) => {
    const messages = await Message.find({ chatId: req.params.chatId }).sort('timestamp');
    res.json(messages);
});

// POST /api/messages - Enviar mensaje
app.post('/api/messages', authMiddleware, async (req, res) => {
    const { chatId, text } = req.body;
    const newMessage = await new Message({ 
        chatId, 
        senderId: req.user.id, 
        text 
    }).save();
    res.status(201).json(newMessage);
});

app.listen(3001, () => console.log('Backend del Chat corriendo en puerto 3001'));