//TODO: PROTOTYPE - NOT INTERACTIVE
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from './ui/separator';

export function Footer() {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/res/images/unisabana_logo_white.png"
                alt="Unisabana Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold">Unisabana</div>
                <div className="text-sm text-white/70">Marketplace</div>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              Plataforma segura para compra y venta dentro de la comunidad universitaria
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Productos</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Vender</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Ayuda</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-accent transition-colors">Electrónica</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Libros</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Deportes</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Accesorios</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Campus La Sabana</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>marketplace@unisabana.edu.co</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+57 (1) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/20 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            © 2026 Universidad de La Sabana. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
