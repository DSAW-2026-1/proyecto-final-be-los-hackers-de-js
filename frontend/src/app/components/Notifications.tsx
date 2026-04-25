//TODO: PROTOTYPE - NOT INTERACTIVE
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  Bell, 
  Package, 
  MessageCircle, 
  Tag, 
  Info, 
  CheckCircle2, 
  Trash2, 
  ShoppingBag,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { useState } from 'react';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'sale',
    title: '¡Nueva venta!',
    description: 'Has vendido "Calculadora TI-84 Plus". Revisa los detalles para coordinar la entrega.',
    time: 'Hace 5 minutos',
    read: false,
    icon: ShoppingBag,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    type: 'shipping',
    title: 'Producto en camino',
    description: 'Tu pedido "MacBook Air M1" ha sido marcado como "En tránsito" por el vendedor.',
    time: 'Hace 2 horas',
    read: false,
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    id: 3,
    type: 'message',
    title: 'Nuevo mensaje',
    description: 'Ana Rodríguez te ha enviado un mensaje sobre "Libro Cálculo III".',
    time: 'Hace 3 horas',
    read: true,
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    id: 4,
    type: 'system',
    title: 'Cuenta Verificada',
    description: '¡Felicidades! Tu cuenta ha sido verificada exitosamente con tu correo institucional.',
    time: 'Ayer, 4:30 PM',
    read: true,
    icon: CheckCircle2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 5,
    type: 'promotion',
    title: 'Baja de precio',
    description: 'Un producto en tus favoritos, "iPad 9na Gen", ha bajado de precio a $1.400.000.',
    time: 'Ayer, 10:15 AM',
    read: true,
    icon: Tag,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  {
    id: 6,
    type: 'system',
    title: 'Actualización de políticas',
    description: 'Hemos actualizado nuestros términos de uso para mejorar la seguridad en el campus.',
    time: 'hace 2 días',
    read: true,
    icon: Info,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-primary">Notificaciones</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-6 px-2">
                  {unreadCount} nuevas
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Mantente al tanto de tus ventas, compras y actividad en el marketplace.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              Marcar todas como leídas
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
              Limpiar todo
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border w-full md:w-auto overflow-x-auto justify-start h-auto p-1">
            <TabsTrigger value="all" className="py-2 px-6">Todas</TabsTrigger>
            <TabsTrigger value="unread" className="py-2 px-6">Sin leer</TabsTrigger>
            <TabsTrigger value="sales" className="py-2 px-6">Ventas</TabsTrigger>
            <TabsTrigger value="purchases" className="py-2 px-6">Compras</TabsTrigger>
            <TabsTrigger value="system" className="py-2 px-6">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            ) : (
              <EmptyNotifications />
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter(n => !n.read).length > 0 ? (
              notifications.filter(n => !n.read).map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            ) : (
              <EmptyNotifications message="No tienes notificaciones sin leer." />
            )}
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            {notifications.filter(n => n.type === 'sale').length > 0 ? (
              notifications.filter(n => n.type === 'sale').map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            ) : (
              <EmptyNotifications message="No tienes notificaciones de ventas." />
            )}
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            {notifications.filter(n => n.type === 'shipping' || n.type === 'promotion').length > 0 ? (
              notifications.filter(n => n.type === 'shipping' || n.type === 'promotion').map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            ) : (
              <EmptyNotifications message="No tienes notificaciones de compras." />
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            {notifications.filter(n => n.type === 'system').length > 0 ? (
              notifications.filter(n => n.type === 'system').map((notif) => (
                <NotificationItem 
                  key={notif.id} 
                  notif={notif} 
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            ) : (
              <EmptyNotifications message="No tienes notificaciones del sistema." />
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-12 p-6 bg-primary/5 border-primary/10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Preferencias de Notificación</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Puedes configurar cómo recibes estas notificaciones (email, app, o ambos) en tus ajustes de perfil.
              </p>
              <Button variant="link" className="p-0 h-auto text-primary">
                Configurar notificaciones <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface Notification {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

function NotificationItem({ notif, onMarkRead, onDelete }: { 
  notif: Notification; 
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const Icon = notif.icon;
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${notif.read ? 'opacity-80' : 'border-l-4 border-l-primary'}`}>
      <div className="p-4 sm:p-6 flex gap-4">
        <div className={`w-12 h-12 rounded-xl ${notif.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${notif.color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className={`font-semibold text-lg leading-tight truncate ${notif.read ? 'text-muted-foreground' : 'text-primary'}`}>
              {notif.title}
            </h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
              {notif.time}
            </span>
          </div>
          <p className={`text-sm mb-4 leading-relaxed ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>
            {notif.description}
          </p>
          
          <div className="flex items-center gap-2">
            {!notif.read && (
              <Button size="sm" variant="secondary" onClick={onMarkRead} className="h-8">
                Marcar como leída
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-8 text-muted-foreground">
              Ver detalle
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive transition-colors"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {!notif.read && (
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
        )}
      </div>
    </Card>
  );
}

function EmptyNotifications({ message = "No tienes notificaciones en este momento." }: { message?: string }) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Bell className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 className="font-semibold text-lg mb-1">Bandeja Vacía</h3>
      <p className="text-muted-foreground">{message}</p>
    </Card>
  );
}
