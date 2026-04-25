import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { MapPin, CreditCard, Smartphone, Banknote, Lock, CheckCircle } from 'lucide-react';

const ORDER_ITEMS = [
  {
    id: 1,
    title: 'MacBook Air M1 2020 - 256GB',
    seller: 'Ana Rodríguez',
    price: 3200000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
  },
  {
    id: 2,
    title: 'Calculadora Científica TI-84 Plus',
    seller: 'María García',
    price: 250000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1611193412775-1f0f77dfe98e?w=100&h=100&fit=crop'
  },
];

export function Checkout() {
  const subtotal = ORDER_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground">
            Completa tu información para coordinar la entrega
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-xl font-semibold">Información de Contacto</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input id="name" placeholder="Juan Pérez" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input id="email" type="email" placeholder="juan.perez@unisabana.edu.co" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input id="phone" type="tel" placeholder="+57 300 123 4567" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h2 className="text-xl font-semibold">Método de Entrega</h2>
              </div>

              <RadioGroup defaultValue="campus" className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="campus" id="campus" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="campus" className="font-medium cursor-pointer flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Recoger en Campus
                      <Badge variant="secondary">Gratis</Badge>
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Coordina directamente con el vendedor para el punto de encuentro
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="delivery" className="font-medium cursor-pointer">
                      Entrega a Domicilio
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      El vendedor coordinará el envío (costo adicional puede aplicar)
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h2 className="text-xl font-semibold">Método de Pago</h2>
              </div>

              <RadioGroup defaultValue="transfer" className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="cash" id="cash" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="cash" className="font-medium cursor-pointer flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      Efectivo en Entrega
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Paga directamente al vendedor al momento de recibir el producto
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="transfer" id="transfer" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="transfer" className="font-medium cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Transferencia Bancaria
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Coordina la transferencia directamente con el vendedor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="nequi" id="nequi" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="nequi" className="font-medium cursor-pointer flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Nequi / Daviplata
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pago por billetera digital
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notas Adicionales (Opcional)</h3>
              <textarea
                className="w-full min-h-24 p-3 border rounded-lg resize-none"
                placeholder="Agrega cualquier información adicional para el vendedor..."
              />
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Resumen del Pedido</h3>

              <div className="space-y-4 mb-6">
                {ORDER_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.seller}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        ${item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
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

              <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Lock className="w-4 h-4 mr-2" />
                Confirmar Pedido
              </Button>

              <div className="mt-6 pt-6 border-t space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Tu información está protegida y encriptada</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Coordinarás directamente con el vendedor verificado</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Recibirás una confirmación por correo electrónico</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
