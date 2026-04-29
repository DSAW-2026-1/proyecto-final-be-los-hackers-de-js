import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import {
  ShoppingCart,
  MessageCircle,
  Star,
  MapPin,
  Shield,
  Package,
  Clock,
  AlertTriangle,
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { productService, Product } from '../services/productService';
import { userService, UserProfileResponse } from '../services/userService';
import { NotFound } from './NotFound';

export function ProductDetail() {
  const { id: productID } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!productID) return;
      try {
        const productData = await productService.getProduct(productID);
        setProduct(productData);
        
        // Fetch seller info
        const sellerData = await userService.getProfileByUid(productData.sellerID);
        setSeller(sellerData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productID]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return <NotFound />;
  }

  const stockStatus = () => {
    if (product.stock <= 0) return { label: 'Agotado', variant: 'destructive' as const, banner: null };
    if (product.stock <= 3) return { 
      label: 'Disponible', 
      variant: 'secondary' as const, 
      banner: product.stock === 1 ? '¡Última unidad disponible!' : `¡Últimas ${product.stock} unidades disponibles!` 
    };
    return { label: 'Disponible', variant: 'secondary' as const, banner: null };
  };

  const status = stockStatus();

  return (
    <div className="bg-muted/30 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-border">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].startsWith('data:') ? product.images[selectedImage] : `data:image/jpeg;base64,${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600 text-white border-none">
                  Pocas unidades
                </Badge>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg py-1 px-4">
                    Agotado
                  </Badge>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {Object.entries(product.images).map(([key, img]) => (
                <button 
                  key={key} 
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === parseInt(key) ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                  }`}
                  onClick={() => setSelectedImage(parseInt(key))}
                >
                  <img
                    src={img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`}
                    alt={`${product.name} thumb ${key}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  {product.category}
                </Badge>
                <Badge variant={status.variant} className="text-xs">
                  {status.label}
                </Badge>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Principal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Publicado recientemente</span>
                </div>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium text-foreground">
                      {Number(product.rating.toFixed(1))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl lg:text-5xl font-bold text-primary">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="text-xl text-muted-foreground">COP</span>
            </div>

            {status.banner && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
                <Clock className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{status.banner}</p>
              </div>
            )}

            <Card className="p-6 bg-secondary/50 border-primary/10">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {seller?.photo ? (
                    <AvatarImage src={seller.photo} alt={seller.username} />
                  ) : (
                    <AvatarFallback className="bg-primary text-white text-xl font-bold">
                      {seller?.username.substring(0, 2).toUpperCase() || 'UN'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{seller?.username || 'Vendedor Unisabana'}</h3>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span>{seller?.career || 'Estudiante'}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-medium text-foreground">{seller?.reputation || 'N/A'}</span>
                      </div>
                      <span>•</span>
                      <span>({seller?.sales || 0} ventas)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
              <Button size="lg" variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Descripción
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Estado</div>
                    <div className="text-sm text-muted-foreground">{product.condition}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive transition-colors">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reportar publicación
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 sm:mt-24 max-w-2xl border-t pt-12">
          <h2 className="text-xl font-bold text-primary mb-8 px-1">Reviews</h2>
          
          {product.rating ? (
            <div className="space-y-8">
              <div className="flex items-center gap-4 sm:gap-6 px-1">
                <span className="text-4xl font-bold text-primary">
                  {Number(product.rating.toFixed(1))}/5
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-8 h-8 ${star <= Math.round(product.rating || 0) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Sample Review */}
              <div className="space-y-4 pt-8 mt-8 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-[#102a43] text-white font-bold">GV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= 4 ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <h4 className="font-bold text-sm text-primary">No incluye el cargador en la caja</h4>
                    <p className="text-xs text-muted-foreground">Gabriel Vega • 2026-04-20</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
                  El macbook me llegó en buen estado, pero el vendedor no incluyó el cargador en la caja. 
                  Afortunadamente le servía el de mi macbook anterior y todo lo demás funciona bien, 
                  pero el vendedor debería mencionar eso en la descripción.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 px-1">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-10 h-10 text-muted-foreground" />
                ))}
              </div>
              <p className="text-muted-foreground italic text-sm">Este producto no tiene reviews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
