import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

// Definimos qué datos necesita el componente para funcionar
interface ContactSellerModalProps {
  product: { id: string; name: string };
  sellerId: string;
  currentUser: { id: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSellerModal({ product, sellerId, currentUser, isOpen, onClose }: ContactSellerModalProps) {
  const [message, setMessage] = useState(`Hola, estoy interesado en tu producto ${product?.name}...`);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!currentUser) return;
    
    setLoading(true); // Feedback: "Iniciando conversación..."
    
    try {
      // 1. Llamada al endpoint para crear o recuperar el chat
      const chatRes = await fetch('http://localhost:3001/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: sellerId,
          buyerId: currentUser.id,
          productId: product.id
        }),
      });

      if (!chatRes.ok) throw new Error('Error al crear el chat');
      const chatData = await chatRes.json();

      // 2. Enviar el mensaje inicial que escribió el usuario
      await fetch('http://localhost:3001/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chatData._id,
          senderId: currentUser.id,
          text: message
        }),
      });

      // 3. Redirigir a la vista de mensajes con el ID del chat
      navigate(`/mensajes/${chatData._id}`);
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Hubo un problema:", error);
      alert("No se pudo iniciar el chat. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contactar Vendedor</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Escribe un mensaje para iniciar la negociación:
          </p>
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleStartChat} disabled={loading}>
            {loading ? "Iniciando conversación..." : "Enviar Mensaje"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}