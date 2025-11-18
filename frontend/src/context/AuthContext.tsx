import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { AuthUser } from '../types';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  hydrated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'b2b_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ token: null, user: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as AuthState;
      setState(parsed);
      if (parsed.token) api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
    }
    setHydrated(true);
  }, []);

  const login = (token: string, user: AuthUser) => {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    const next = { token, user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const logout = () => {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(STORAGE_KEY);
    setState({ token: null, user: null });
  };

  const value: AuthContextValue = { ...state, login, logout, hydrated };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
