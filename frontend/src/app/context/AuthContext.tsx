import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(authService.isAdminAuthenticated());

  useEffect(() => {
    // Sync state if token changes elsewhere (e.g. storage event)
    const handleStorageChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setIsAdminAuthenticated(authService.isAdminAuthenticated());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string) => {
    authService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const adminLogin = (token: string) => {
    authService.setAdminToken(token);
    setIsAdminAuthenticated(true);
  };

  const adminLogout = () => {
    authService.adminLogout();
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdminAuthenticated, 
      login, 
      logout,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
