import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { AlertTriangle, FileText, Upload, X } from 'lucide-react';
import { Link } from 'react-router';

export function ReportView() {
  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary">Reportar Problema</h1>
              <p className="text-muted-foreground">
                Ayúdanos a mantener un marketplace seguro y confiable
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Información del Producto Reportado</h2>

              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                <div className="w-20 h-20 rounded bg-white overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop"
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">MacBook Air M1 2020 - 256GB</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Publicado por Ana Rodríguez
                  </p>
                  <Badge>Computadores</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Tipo de Reporte</h2>

              <RadioGroup defaultValue="" className="space-y-3">
                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="fraud" id="fraud" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="fraud" className="font-medium cursor-pointer">
                      Posible Fraude o Estafa
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      El producto o vendedor parece sospechoso o fraudulento
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="misleading" id="misleading" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="misleading" className="font-medium cursor-pointer">
                      Información Engañosa
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      La descripción no coincide con el producto real
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="prohibited" id="prohibited" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="prohibited" className="font-medium cursor-pointer">
                      Producto Prohibido
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Artículo que no está permitido en el marketplace
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="spam" id="spam" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="spam" className="font-medium cursor-pointer">
                      Spam o Duplicado
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Publicación repetida o contenido spam
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="inappropriate" id="inappropriate" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="inappropriate" className="font-medium cursor-pointer">
                      Contenido Inapropiado
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Imágenes o texto ofensivo o inapropiado
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="other" id="other" className="mt-1" />
                  <div className="flex-1">
                    <label htmlFor="other" className="font-medium cursor-pointer">
                      Otro Motivo
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Otro problema no listado arriba
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Detalles del Reporte</h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Reporte *</Label>
                  <Input
                    id="title"
                    placeholder="Resumen breve del problema"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Detallada *</Label>
                  <Textarea
                    id="description"
                    placeholder="Por favor describe el problema con el mayor detalle posible. Incluye fechas, capturas de pantalla si aplica, y cualquier otra información relevante."
                    className="min-h-40 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 50 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Evidencia (Opcional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">Sube capturas de pantalla</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG hasta 5MB (máx. 3 archivos)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="relative aspect-square rounded border-2 border-border bg-muted overflow-hidden group">
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-muted-foreground" />
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

                <div className="space-y-2">
                  <Label htmlFor="contact">Tu Correo de Contacto *</Label>
                  <Input
                    id="contact"
                    type="email"
                    placeholder="nombre@unisabana.edu.co"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para darte seguimiento sobre tu reporte
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1 text-sm">
                  <h3 className="font-semibold mb-2 text-orange-900">
                    Información Importante
                  </h3>
                  <ul className="space-y-1 text-orange-800">
                    <li>• Los reportes falsos o malintencionados pueden resultar en sanciones</li>
                    <li>• Tu reporte será revisado por el equipo de moderación en 24-48 horas</li>
                    <li>• Recibirás una notificación sobre el estado de tu reporte</li>
                    <li>• La información del reportante se mantiene confidencial</li>
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
              <Checkbox id="confirm" className="mt-1" />
              <label htmlFor="confirm" className="text-sm cursor-pointer leading-relaxed">
                Confirmo que la información proporcionada es verdadera y precisa, y entiendo que
                los reportes falsos pueden resultar en la suspensión de mi cuenta.
              </label>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-primary hover:bg-primary/90" size="lg">
                Enviar Reporte
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Cancelar
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">¿Necesitas Ayuda?</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Preguntas Frecuentes</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <Link to="#" className="hover:text-primary transition-colors">
                        ¿Qué productos están prohibidos?
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="hover:text-primary transition-colors">
                        ¿Cómo identificar un fraude?
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="hover:text-primary transition-colors">
                        ¿Qué pasa después de reportar?
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Contacto Directo</h4>
                  <p className="text-muted-foreground mb-3">
                    Si necesitas asistencia inmediata, contacta a nuestro equipo de soporte.
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    Contactar Soporte
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Reportes Urgentes</h4>
                  <p className="text-muted-foreground">
                    Para casos de emergencia o amenazas inmediatas, contacta a seguridad del campus:
                  </p>
                  <p className="font-semibold text-primary mt-2">
                    📞 +57 (1) 861-5555
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
