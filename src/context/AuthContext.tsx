import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('avenza_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Session verification failed, clearing token');
          localStorage.removeItem('avenza_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    localStorage.setItem('avenza_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const signup = async (data: any) => {
    const res = await api.signup(data);
    localStorage.setItem('avenza_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('avenza_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
