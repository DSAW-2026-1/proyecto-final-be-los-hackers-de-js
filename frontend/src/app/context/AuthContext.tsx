import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface UserInfo {
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isSeller: boolean;
  user: UserInfo | null;
  login: (token: string) => void;
  logout: () => void;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
  setUserInfo: (user: UserInfo) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(authService.isAdminAuthenticated());
  const [isSeller, setIsSeller] = useState<boolean>(authService.isSeller());
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Sync state if token changes elsewhere (e.g. storage event)
    const handleStorageChange = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setIsAdminAuthenticated(authService.isAdminAuthenticated());
      setIsSeller(authService.isSeller());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (token: string) => {
    authService.setToken(token);
    setIsAuthenticated(true);
    setIsSeller(authService.isSeller());
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsSeller(false);
    setUser(null);
  };

  const adminLogin = (token: string) => {
    authService.setAdminToken(token);
    setIsAdminAuthenticated(true);
  };

  const adminLogout = () => {
    authService.adminLogout();
    setIsAdminAuthenticated(false);
  };

  const setUserInfo = (userInfo: UserInfo) => {
    setUser(userInfo);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdminAuthenticated, 
      isSeller,
      user,
      login, 
      logout,
      adminLogin,
      adminLogout,
      setUserInfo
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
