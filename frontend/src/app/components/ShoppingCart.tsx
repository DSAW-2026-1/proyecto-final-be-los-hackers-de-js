import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';

const CART_ITEMS = [
  {
    id: 1,
    title: 'MacBook Air M1 2020 - 256GB',
    seller: 'Ana Rodríguez',
    price: 3200000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
    condition: 'Usado - Como Nuevo'
  },
  {
    id: 2,
    title: 'Calculadora Científica TI-84 Plus',
    seller: 'María García',
    price: 250000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1611193412775-1f0f77dfe98e?w=200&h=200&fit=crop',
    condition: 'Usado'
  },
];

export function ShoppingCart() {
  const subtotal = CART_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Carrito de Compras</h1>
          <p className="text-muted-foreground">
            {CART_ITEMS.length} {CART_ITEMS.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {CART_ITEMS.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Tu carrito está vacío</h3>
                    <p className="text-muted-foreground mb-4">
                      Agrega productos del marketplace para comenzar
                    </p>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">
                    Explorar Productos
                  </Button>
                </div>
              </Card>
            ) : (
              CART_ITEMS.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Vendido por {item.seller}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {item.condition}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">COP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}

            {CART_ITEMS.length > 0 && (
              <Card className="p-6 bg-accent/10 border-accent/20">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <Input
                      placeholder="¿Tienes un código de descuento?"
                      className="bg-white"
                    />
                  </div>
                  <Button variant="outline">
                    Aplicar
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Resumen del Pedido</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium text-green-600">
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <span className="font-bold text-primary text-2xl">
                      ${total.toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">COP</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={CART_ITEMS.length === 0}
                >
                  Proceder al Pago
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Continuar Comprando
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-sm mb-3">Métodos de pago aceptados</h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-3 py-2 bg-muted rounded border text-xs font-medium">
                    Efectivo
                  </div>
                  <div className="px-3 py-2 bg-muted rounded border text-xs font-medium">
                    Transferencia
                  </div>
                  <div className="px-3 py-2 bg-muted rounded border text-xs font-medium">
                    Nequi
                  </div>
                  <div className="px-3 py-2 bg-muted rounded border text-xs font-medium">
                    Daviplata
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-xs text-muted-foreground space-y-2">
                <p>✓ Compra segura entre estudiantes verificados</p>
                <p>✓ Soporte de la universidad</p>
                <p>✓ Entrega en campus o domicilio</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
