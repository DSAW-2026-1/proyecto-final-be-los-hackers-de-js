import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Upload, X, MapPin, DollarSign, Package, Save, ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { productService, Product } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { NotFound } from './NotFound';
import { CATEGORIES, CONDITIONS, LOCATIONS } from '../constants';

export function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { uid } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const data = await productService.getProduct(id);
        
        // Authorization check
        if (uid && data.sellerID !== uid) {
          toast.error('No tienes permiso para editar este producto');
          navigate(`/product/${id}`);
          return;
        }
        
        setProduct(data);
      } catch (err: unknown) {
        console.error('Error fetching product:', err);
        if (err instanceof Error && (err.message?.includes('404'))) {
          setNotFound(true);
        } else if (typeof err === 'object' && err !== null && 'status' in err && err.status === 404) {
          setNotFound(true);
        } else {
          setError(true);
          toast.error('Error al cargar el producto');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, uid, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Cargando información del producto...</p>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
          <X className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-primary">Error al cargar</h2>
        <p className="text-muted-foreground max-w-md">
          Hubo un problema al intentar obtener la información del producto. Por favor intenta de nuevo más tarde.
        </p>
        <Button onClick={() => navigate('/seller')} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="pl-0 text-muted-foreground hover:text-primary"
                onClick={() => navigate('/seller')}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al Panel
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">Editar Producto</h1>
            <p className="text-muted-foreground">
              ID de publicación: <span className="font-mono text-foreground font-medium">{id}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Información Básica</h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Producto *</Label>
                  <Input
                    id="name"
                    defaultValue={product.name}
                    placeholder="Ej: MacBook Air M1 2020 - 256GB"
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Máx. 80 caracteres
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                      <Select defaultValue={product.category}>
                        <SelectTrigger className="pl-11">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Estado *</Label>
                    <Select defaultValue={product.condition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map(cond => (
                          <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    defaultValue={product.description}
                    placeholder="Describe tu producto..."
                    className="min-h-32 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (COP) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        defaultValue={product.price}
                        placeholder="0"
                        className="pl-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="negotiable">Negociable</Label>
                    <Select defaultValue={product.negotiable ? 'si' : 'no'}>
                      <SelectTrigger>
                        <SelectValue placeholder="¿El precio es negociable?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí, acepto ofertas</SelectItem>
                        <SelectItem value="no">No, precio fijo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación de Entrega *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select defaultValue={product.location}>
                      <SelectTrigger className="pl-11">
                        <SelectValue placeholder="Selecciona dónde entregarás" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map(loc => (
                          <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Imágenes del Producto</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {Object.entries(product.images).map(([key, img]) => (
                    <div key={key} className="relative aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden group">
                      <img 
                        src={img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {key === '0' && (
                        <Badge className="absolute bottom-2 left-2 bg-primary">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}
                  {Object.keys(product.images).length < 6 && (
                    <div className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-center p-4">
                      <Upload className="w-6 h-6 text-primary mb-2" />
                      <span className="text-xs text-muted-foreground font-medium">Agregar más</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG hasta 5MB (máx. 6 imágenes)
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Detalles de Publicación</h3>

              <div className="space-y-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendedor ID:</span>
                    <span className="font-medium truncate ml-2 max-w-[120px]">{product.sellerID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stock actual:</span>
                    <span className="font-medium text-primary">{product.stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ventas:</span>
                    <span className="font-medium">{product.sales || 0}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3">Recomendaciones:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                       <span className="text-green-500 font-bold">✓</span>
                       Tu publicación está activa y disponible para compradores.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-muted-foreground" 
                    size="lg"
                    onClick={() => navigate(`/product/${id}`)}
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

