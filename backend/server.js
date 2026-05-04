const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a MongoDB (Asegúrate de tener MongoDB instalado o una URI de Atlas)
mongoose.connect('mongodb://localhost:27017/marketplace-chat');

// 2. Definición de Modelos
const ChatSchema = new mongoose.Schema({
    participants: [{ type: String, required: true }], // IDs de usuarios
    productId: { type: String, required: true }
});
const Chat = mongoose.model('Chat', ChatSchema);

const MessageSchema = new mongoose.Schema({
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    senderId: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 3. Rutas (Endpoints)

// A. Crear o recuperar un chat
app.post('/api/chats', async (req, res) => {
    const { sellerId, buyerId, productId } = req.body;
    let chat = await Chat.findOne({ participants: { $all: [sellerId, buyerId] }, productId });
    
    if (!chat) {
        chat = await new Chat({ participants: [sellerId, buyerId], productId }).save();
    }
    res.json(chat);
});

// B. Obtener mensajes de un chat
app.get('/api/messages/:chatId', async (req, res) => {
    const messages = await Message.find({ chatId: req.params.chatId }).sort('timestamp');
    res.json(messages);
});

// C. Enviar un mensaje
app.post('/api/messages', async (req, res) => {
    const { chatId, senderId, text } = req.body;
    const newMessage = await new Message({ chatId, senderId, text }).save();
    res.status(201).json(newMessage);
});

// 4. Iniciar Servidor
app.listen(3001, () => console.log('Backend corriendo en puerto 3001'));
