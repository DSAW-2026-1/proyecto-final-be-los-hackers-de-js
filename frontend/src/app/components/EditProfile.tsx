import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  Bell, 
  ShieldCheck, 
  ArrowLeft,
  Save,
  Building,
  GraduationCap
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

export function EditProfile() {
  const [profileImage] = useState<string | null>(null);

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Ver Mi Perfil
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">Configuración de Cuenta</h1>
          <p className="text-muted-foreground">Administra tu información personal y preferencias de seguridad</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="space-y-1">
              <Button variant="secondary" className="w-full justify-start font-semibold">
                <User className="w-4 h-4 mr-3" />
                Información Pública
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Lock className="w-4 h-4 mr-3" />
                Seguridad
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <Bell className="w-4 h-4 mr-3" />
                Notificaciones
              </Button>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                <ShieldCheck className="w-4 h-4 mr-3" />
                Privacidad
              </Button>
            </div>
          </aside>

          {/* Main Content Areas */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Header Edit */}
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-1 ring-border">
                    <AvatarImage src={profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'} />
                    <AvatarFallback>LM</AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-transform active:scale-95">
                    <Camera className="w-4 h-4" />
                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-1">Tu Foto de Perfil</h2>
                    <p className="text-sm text-muted-foreground">Esta foto será visible para compradores y vendedores en el campus.</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <Button size="sm">Actualizar Foto</Button>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">Eliminar</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Basic Info Container */}
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Información del Estudiante
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue="Laura" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue="Martínez" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <Label htmlFor="bio">Sobre mí (Resumen)</Label>
                <Textarea 
                  id="bio" 
                  defaultValue="Estudiante de Ingeniería Informática • Vendedor confiable de tecnología y accesorios" 
                  className="min-h-24 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">86 / 200 caracteres</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Facultad</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select defaultValue="ingenieria">
                      <SelectTrigger className="pl-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ingenieria">Facultad de Ingeniería</SelectItem>
                        <SelectItem value="medicina">Facultad de Medicina</SelectItem>
                        <SelectItem value="comunicacion">Facultad de Comunicación</SelectItem>
                        <SelectItem value="derecho">Facultad de Derecho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Programa Académico</Label>
                   <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select defaultValue="sistemas">
                      <SelectTrigger className="pl-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sistemas">Ingeniería Informática</SelectItem>
                        <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                        <SelectItem value="civil">Ingeniería Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info container */}
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contacto y Ubicación
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Institucional</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="email" defaultValue="laura.m@unisabana.edu.co" disabled className="pl-11 bg-muted/50" />
                  </div>
                  <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Email Verificado ✓</Badge>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono de Contacto (Opcional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="phone" defaultValue="+57 300 456 7890" className="pl-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación Frecuente en Campus</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="location" defaultValue="Edificio de Ingeniería / Biblioteca" className="pl-11" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferences Container */}
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Preferencias de Notificaciones
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nuevos Mensajes</p>
                    <p className="text-sm text-muted-foreground">Recibe avisos cuando alguien te escriba un chat.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ventas Realizadas</p>
                    <p className="text-sm text-muted-foreground">Notificaciones sobre compras de tus productos.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ofertas y Promociones</p>
                    <p className="text-sm text-muted-foreground">Novedades sobre el marketplace universitario.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>

            {/* Sticky Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" size="lg">Cancelar</Button>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Save className="w-5 h-5 mr-2" />
                Guardar Todos los Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
