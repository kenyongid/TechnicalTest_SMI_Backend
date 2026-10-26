/**
 * AuthContext.jsx
 *
 * Context autentikasi global.
 * Token disimpan di memory (React state), bukan localStorage,
 * sehingga tidak persisten setelah refresh — sesuai kebutuhan keamanan.
 *
 * File ini mengekspor AuthProvider dan useAuth dalam satu file.
 * Konfigurasi ESLint react-refresh dikecualikan karena file ini
 * berisi hook (useAuth) yang di-export bersama komponen, yang merupakan
 * pola umum untuk Context API dan tidak memengaruhi Hot Module Replacement
 * secara negatif dalam praktiknya.
 */

import { createContext, useCallback, useContext, useState } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Provider yang membungkus seluruh aplikasi dan menyediakan state autentikasi.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  /**
   * Melakukan login: memanggil API, menyimpan token dan user di state.
   * @param {string} email
   * @param {string} password
   * @throws {Error} Jika login gagal
   */
  const login = useCallback(async (email, password) => {
    const data = await loginService(email, password);
    setToken(data.token);
    setUser(data.user);
  }, []);

  /**
   * Melakukan logout: mencabut token di backend, membersihkan state.
   */
  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutService(token);
      } catch {
        // Tetap bersihkan state meski backend gagal
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

/**
 * Hook untuk mengakses context autentikasi.
 * Harus digunakan di dalam AuthProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components -- Dipasangkan dengan AuthProvider di file yang sama
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}
