//TODO: PROTOTYPE - NOT INTERACTIVE
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Upload, X, MapPin, DollarSign, Package, Image as ImageIcon } from 'lucide-react';

export function CreateProduct() {
  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Publicar Producto</h1>
          <p className="text-muted-foreground">
            Completa la información de tu producto para publicarlo en el marketplace
          </p>
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
                    placeholder="Ej: MacBook Air M1 2020 - 256GB"
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Sé descriptivo y específico (máx. 80 caracteres)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                      <Select>
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
                    <Select>
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
                    placeholder="Describe tu producto: características, estado, accesorios incluidos, razón de venta, etc."
                    className="min-h-32 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 50 caracteres
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (COP) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="0"
                        className="pl-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="negotiable">Negociable</Label>
                    <Select>
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
                    <Select>
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
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Arrastra tus imágenes aquí</p>
                      <p className="text-sm text-muted-foreground">
                        o haz clic para seleccionar archivos
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG hasta 5MB (máx. 6 imágenes)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative aspect-square rounded-lg border-2 border-border bg-muted overflow-hidden group">
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {i === 1 && (
                        <Badge className="absolute bottom-2 left-2 bg-primary">
                          Principal
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Vista Previa</h3>

              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>

                <div>
                  <Badge variant="secondary" className="mb-2">Categoría</Badge>
                  <h3 className="font-semibold text-lg mb-2">Título del producto</h3>
                  <p className="text-2xl font-bold text-primary mb-2">$0</p>
                  <p className="text-sm text-muted-foreground">
                    Descripción del producto...
                  </p>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold text-sm">Consejos:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>✓ Usa fotos claras y bien iluminadas</li>
                    <li>✓ Incluye todos los detalles importantes</li>
                    <li>✓ Sé honesto sobre el estado del producto</li>
                    <li>✓ Responde rápido a los mensajes</li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    Publicar Producto
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Guardar Borrador
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
