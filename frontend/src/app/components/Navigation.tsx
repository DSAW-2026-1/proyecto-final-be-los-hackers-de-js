import { ShoppingCart, Bell, User, Search, Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/res/images/unisabana_logo_blue.png"
                alt="Unisabana Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-primary">Unisabana</div>
                <div className="text-xs text-muted-foreground">Marketplace</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
                }
              >
                Inicio
              </NavLink>
              <NavLink 
                to="/search" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
                }
              >
                Productos
              </NavLink>
              <NavLink 
                to="/seller" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
                }
              >
                Mis Ventas
              </NavLink>
              <NavLink 
                to="/chat" 
                className={({ isActive }) => 
                  `text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'hover:text-primary'}`
                }
              >
                Mensajes
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center relative w-80">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
              />
            </div>

            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-accent text-xs">
                  3
                </Badge>
              </Button>
            </Link>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-accent text-xs">
                  2
                </Badge>
              </Button>
            </Link>

            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
