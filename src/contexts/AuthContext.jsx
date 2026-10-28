import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [token, user]);

  /**
   * Fungsi untuk login pengguna
   * @param {string} email
   * @param {string} password
   * @throws {Error} 
   */
  const login = useCallback(async (email, password) => {
    try {
      const data = await loginService(email, password);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (token && user) {
      try {
        await logoutService(token);
      } catch {
        // Abaikan error saat logout jika token sudah invalid
      }
    }
    setToken(null);
    setUser(null);
  }, [token]);

  const isAuthenticated = token !== null;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}