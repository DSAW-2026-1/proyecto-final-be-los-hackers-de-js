//TODO: PROTOTYPE - NOT INTERACTIVE
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Upload, X, MapPin, DollarSign, Package, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';

const MOCK_PRODUCT = {
  id: 'P-12345',
  title: 'MacBook Air M1 2020 - 256GB',
  category: 'computadores',
  condition: 'como-nuevo',
  description: 'MacBook Air en excelente estado, apenas 1 año de uso. Incluye cargador original y funda protectora. Batería en perfectas condiciones (92% de salud). Ideal para estudiantes de cualquier carrera. Sin golpes ni rayones.',
  price: 3200000,
  negotiable: 'si',
  location: 'campus',
  images: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
  ]
};

export function EditProduct() {
  const [product] = useState(MOCK_PRODUCT);

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al Panel
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-primary mb-2">Editar Producto</h1>
            <p className="text-muted-foreground">
              ID de publicación: <span className="font-mono text-foreground font-medium">{product.id}</span>
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
                    id="title"
                    defaultValue={product.title}
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
                          <SelectItem value="electronica">Electrónica</SelectItem>
                          <SelectItem value="computadores">Computadores</SelectItem>
                          <SelectItem value="libros">Libros</SelectItem>
                          <SelectItem value="deportes">Deportes</SelectItem>
                          <SelectItem value="ropa">Ropa</SelectItem>
                          <SelectItem value="accesorios">Accesorios</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
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
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="como-nuevo">Usado - Como Nuevo</SelectItem>
                        <SelectItem value="buen-estado">Usado - Buen Estado</SelectItem>
                        <SelectItem value="aceptable">Usado - Aceptable</SelectItem>
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
                    <Select defaultValue={product.negotiable}>
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
                        <SelectItem value="campus">Campus Principal</SelectItem>
                        <SelectItem value="edificio-a">Edificio A</SelectItem>
                        <SelectItem value="edificio-b">Edificio B</SelectItem>
                        <SelectItem value="edificio-c">Edificio C</SelectItem>
                        <SelectItem value="biblioteca">Biblioteca</SelectItem>
                        <SelectItem value="zona-deportiva">Zona Deportiva</SelectItem>
                        <SelectItem value="domicilio">Envío a domicilio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Imágenes del Producto</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {i === 0 && (
                        <Badge className="absolute bottom-2 left-2 bg-primary">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-border rounded-lg aspect-square flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer text-center p-4">
                    <Upload className="w-6 h-6 text-primary mb-2" />
                    <span className="text-xs text-muted-foreground font-medium">Agregar más</span>
                  </div>
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
                    <span className="text-muted-foreground">Fecha publicación:</span>
                    <span className="font-medium">18 Abr 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última edición:</span>
                    <span className="font-medium">Hace 2 días</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total visitas:</span>
                    <span className="font-medium text-primary">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contactos:</span>
                    <span className="font-medium text-primary">8</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-sm mb-3">Recomendaciones:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                       <span className="text-green-500 font-bold">✓</span>
                       Tu descripción generó 20% más visitas que el promedio.
                    </li>
                    <li className="flex gap-2">
                       <span className="text-amber-500 font-bold">!</span>
                       Considera bajar un 5% el precio para vender más rápido.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" className="w-full text-muted-foreground" size="lg">
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
