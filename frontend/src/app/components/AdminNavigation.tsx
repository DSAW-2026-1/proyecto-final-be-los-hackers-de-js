import { Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

import UnisabanaLogo from "./../../../res/images/unisabana_logo_blue.png"

export function AdminNavigation() {
  const {adminLogout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate back to the marketplace home first.
    // We use replace to ensure the admin dashboard isn't left in the history stack.
    navigate('/', { replace: true });
    
    // We defer the session clearance to the next event loop tick.
    // This allows React Router to process the navigation and unmount the 
    // AdminProtectedRoute-wrapped components before the admin session is cleared,
    // preventing an unwanted redirect to the /admin/login page.
    setTimeout(() => {
      adminLogout();
    }, 0);
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
                    <LogOut className="w-4 h-4 mr-2" />
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
