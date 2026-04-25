import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  ShoppingCart,
  MessageCircle,
  Star,
  MapPin,
  Shield,
  Package,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function ProductDetail() {
  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop"
                alt="Product"
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-primary">
                Destacado
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-primary">
                  <div className="w-full h-full bg-muted" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3">
                Computadores
              </Badge>
              <h1 className="text-4xl font-bold text-primary mb-3">
                MacBook Air M1 2020 - 256GB
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Principal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Publicado hace 2 días</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-primary">
                $3,200,000
              </span>
              <span className="text-xl text-muted-foreground">COP</span>
            </div>

            <Card className="p-6 bg-secondary/50 border-primary/10">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    AR
                  </div>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">Ana Rodríguez</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Ingeniería Informática</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">4.9</span>
                      <span>(23 ventas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar
              </Button>
            </div>

            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reportar publicación
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">
                MacBook Air en excelente estado, apenas 1 año de uso. Incluye cargador original
                y funda protectora. Batería en perfectas condiciones (92% de salud).
                Ideal para estudiantes de cualquier carrera. Sin golpes ni rayones.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Estado</div>
                    <div className="text-sm text-muted-foreground">Usado - Como Nuevo</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Garantía</div>
                    <div className="text-sm text-muted-foreground">Apple Care hasta 2025</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Procesador</span>
                  <span className="font-medium">Apple M1</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-medium">8GB</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Almacenamiento</span>
                  <span className="font-medium">256GB SSD</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Pantalla</span>
                  <span className="font-medium">13.3" Retina</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
