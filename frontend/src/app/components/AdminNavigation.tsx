import { ShoppingCart, Bell, User, Search, Menu, LogIn, UserPlus, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { userService } from '../services/userService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import UnisabanaLogo from "./../../../res/images/unisabana_logo_blue.png"

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function AdminNavigation() {
  const { isAuthenticated, user, setUserInfo, adminLogout, isSeller } = useAuth();
  const { totalItems } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !user) {
      userService.getProfile().then(profile => {
        setUserInfo({
          username: profile.username,
          email: profile.email
        });
      }).catch(err => {
        console.error('Failed to fetch user profile in navigation:', err);
      });
    }
  }, [isAuthenticated, user, setUserInfo]);

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="flex items-center gap-2">
              <img
                src={UnisabanaLogo}
                alt="Unisabana Logo"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-primary">Unisabana</div>
                <div className="text-xs text-muted-foreground">Marketplace</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">

              <div className="flex items-center gap-2">
                  <Button variant="ghost" className="hidden sm:flex" onClick={handleLogout}>
                    {/*TODO: Replace the icon with a more logical logout icon*/}
                    <LogIn className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </Button>
              </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
