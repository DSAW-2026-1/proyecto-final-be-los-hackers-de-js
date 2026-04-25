import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { Star, Upload, X, CheckCircle, Package, User, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const ORDER = {
  id: 'ORD-2024-001',
  date: '2026-04-18',
  deliveredDate: '2026-04-20',
  product: {
    title: 'MacBook Air M1 2020 - 256GB',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
  },
  seller: {
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@unisabana.edu.co',
    program: 'Ingeniería Informática',
    currentRating: 4.9,
    totalReviews: 22
  }
};

const StarRating = ({
  rating,
  setRating,
  hoverRating,
  setHoverRating
}: {
  rating: number;
  setRating: (r: number) => void;
  hoverRating: number;
  setHoverRating: (r: number) => void;
}) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-10 h-10 ${
              star <= (hoverRating || rating)
                ? 'fill-accent text-accent'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export function LeaveReview() {
  const [productRating, setProductRating] = useState(0);
  const [productHoverRating, setProductHoverRating] = useState(0);
  const [sellerRating, setSellerRating] = useState(0);
  const [sellerHoverRating, setSellerHoverRating] = useState(0);

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="outline" size="sm">← Volver</Button>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Calificar Compra</h1>
          <p className="text-muted-foreground">
            Comparte tu experiencia con la comunidad
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Producto Recibido</h2>

              <div className="flex gap-6 mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={ORDER.product.image}
                    alt={ORDER.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{ORDER.product.title}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Pedido: {ORDER.id}</span>
                    <span className="text-muted-foreground">•</span>
                    <Badge className="bg-green-600">Entregado</Badge>
                  </div>
                  <p className="font-bold text-primary mt-2">
                    ${ORDER.product.price.toLocaleString()} COP
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Califica el Producto</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">¿Qué tal estuvo el producto? *</Label>
                  <StarRating
                    rating={productRating}
                    setRating={setProductRating}
                    hoverRating={productHoverRating}
                    setHoverRating={setProductHoverRating}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {productRating === 0 && 'Selecciona una calificación'}
                    {productRating === 1 && 'Muy malo'}
                    {productRating === 2 && 'Malo'}
                    {productRating === 3 && 'Regular'}
                    {productRating === 4 && 'Bueno'}
                    {productRating === 5 && '¡Excelente!'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productReview">Cuéntanos tu experiencia con el producto *</Label>
                  <Textarea
                    id="productReview"
                    placeholder="Describe la calidad del producto, si coincidió con la descripción, estado en que llegó, etc."
                    className="min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 50 caracteres
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">¿El producto coincidió con la descripción?</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="yes" id="match-yes" />
                      <label htmlFor="match-yes" className="flex-1 cursor-pointer">
                        Sí, totalmente como se describió
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="mostly" id="match-mostly" />
                      <label htmlFor="match-mostly" className="flex-1 cursor-pointer">
                        Mayormente, con diferencias menores
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="no" id="match-no" />
                      <label htmlFor="match-no" className="flex-1 cursor-pointer">
                        No, fue diferente a lo esperado
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Fotos del Producto (Opcional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">Sube fotos del producto</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG hasta 5MB (máx. 3 fotos)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="relative aspect-square rounded border-2 border-border bg-muted overflow-hidden group">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">📷</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Califica al Vendedor</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                      {ORDER.seller.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{ORDER.seller.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {ORDER.seller.program}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{ORDER.seller.currentRating}</span>
                      <span className="text-muted-foreground">
                        ({ORDER.seller.totalReviews} reseñas)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">¿Qué tal fue tu experiencia con el vendedor? *</Label>
                  <StarRating
                    rating={sellerRating}
                    setRating={setSellerRating}
                    hoverRating={sellerHoverRating}
                    setHoverRating={setSellerHoverRating}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {sellerRating === 0 && 'Selecciona una calificación'}
                    {sellerRating === 1 && 'Muy malo'}
                    {sellerRating === 2 && 'Malo'}
                    {sellerRating === 3 && 'Regular'}
                    {sellerRating === 4 && 'Bueno'}
                    {sellerRating === 5 && '¡Excelente!'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerReview">Cuéntanos sobre el vendedor *</Label>
                  <Textarea
                    id="sellerReview"
                    placeholder="Describe la comunicación, puntualidad, honestidad, y profesionalismo del vendedor..."
                    className="min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 50 caracteres
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Aspectos a destacar (Opcional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Buena comunicación', icon: MessageCircle },
                      { label: 'Puntual', icon: CheckCircle },
                      { label: 'Producto como se describió', icon: Package },
                      { label: 'Precio justo', icon: Star },
                    ].map((aspect, index) => {
                      const Icon = aspect.icon;
                      return (
                        <button
                          key={index}
                          type="button"
                          className="flex items-center gap-2 p-3 border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{aspect.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">¿Recomendarías este vendedor?</Label>
                  <RadioGroup defaultValue="">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="yes" id="recommend-yes" />
                      <label htmlFor="recommend-yes" className="flex-1 cursor-pointer">
                        Sí, definitivamente
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <label htmlFor="recommend-maybe" className="flex-1 cursor-pointer">
                        Tal vez, con reservas
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <label htmlFor="recommend-no" className="flex-1 cursor-pointer">
                        No lo recomendaría
                      </label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold mb-2 text-blue-900">
                    Lineamientos para Reseñas
                  </h4>
                  <ul className="space-y-1 text-blue-800 text-xs">
                    <li>• Sé honesto y constructivo en tus comentarios</li>
                    <li>• Evita lenguaje ofensivo o inapropiado</li>
                    <li>• Enfócate en tu experiencia personal con el producto y vendedor</li>
                    <li>• Las reseñas son públicas y ayudan a la comunidad</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
                disabled={productRating === 0 || sellerRating === 0}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Publicar Reseña
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Cancelar
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resumen de tu Reseña</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Calificación del Producto</p>
                  <div className="flex items-center gap-2">
                    {productRating > 0 ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < productRating ? 'fill-accent text-accent' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="font-bold text-lg ml-2">{productRating}.0</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">No calificado</span>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Calificación del Vendedor</p>
                  <div className="flex items-center gap-2">
                    {sellerRating > 0 ? (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < sellerRating ? 'fill-accent text-accent' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                        <span className="font-bold text-lg ml-2">{sellerRating}.0</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">No calificado</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold text-sm mb-3">Detalles del Pedido</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pedido:</span>
                  <span className="font-medium">{ORDER.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de compra:</span>
                  <span className="font-medium">{ORDER.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de entrega:</span>
                  <span className="font-medium">{ORDER.deliveredDate}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-semibold mb-2 text-green-900">
                    Tu Opinión Importa
                  </h4>
                  <p className="text-green-800 text-xs">
                    Las reseñas honestas ayudan a mantener un marketplace confiable y seguro para toda la comunidad universitaria.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold text-sm mb-3">¿Tuviste un problema?</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Si experimentaste algún problema grave con esta transacción, puedes reportarlo directamente.
              </p>
              <Button variant="outline" className="w-full" size="sm">
                Reportar Problema
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
