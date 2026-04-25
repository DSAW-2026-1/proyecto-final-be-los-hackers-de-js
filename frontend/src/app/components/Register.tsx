//TODO: PROTOTYPE - NOT INTERACTIVE
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Mail, Lock, Phone, GraduationCap, Building } from 'lucide-react';

export function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-[#1e4976] flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

      <Card className="w-full max-w-2xl relative z-10 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/res/images/unisabana_logo_with_text_blue.png"
                alt="Unisabana Logo"
                className="h-24 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Crear Cuenta</h1>
            <p className="text-muted-foreground">
              Únete a la comunidad de Unisabana Marketplace
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="Juan"
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    className="pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Institucional</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre.apellido@unisabana.edu.co"
                  className="pl-11"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Debes usar tu correo institucional de La Sabana
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (Opcional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className="pl-11"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="faculty">Facultad</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Select>
                    <SelectTrigger className="pl-11">
                      <SelectValue placeholder="Selecciona tu facultad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ingenieria">Ingeniería</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="economia">Economía y Administración</SelectItem>
                      <SelectItem value="derecho">Derecho</SelectItem>
                      <SelectItem value="comunicacion">Comunicación</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Programa</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Select>
                    <SelectTrigger className="pl-11">
                      <SelectValue placeholder="Selecciona tu programa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sistemas">Ingeniería Informática</SelectItem>
                      <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                      <SelectItem value="civil">Ingeniería Civil</SelectItem>
                      <SelectItem value="electronica">Ingeniería Electrónica</SelectItem>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="administracion">Administración de Empresas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-1" />
                <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Acepto los{' '}
                  <a href="#" className="text-primary hover:underline">
                    Términos y Condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary hover:underline">
                    Política de Privacidad
                  </a>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="notifications" className="mt-1" />
                <label htmlFor="notifications" className="text-sm cursor-pointer leading-relaxed">
                  Deseo recibir notificaciones sobre nuevos productos y ofertas
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
              Crear Cuenta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <a href="#" className="text-primary font-medium hover:underline">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
