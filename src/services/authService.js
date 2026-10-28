/**
 * authService.js
 *
 * Fungsi autentikasi.
 *
 * Strategi: Frontend-first dengan dummy credentials.
 * Backend Laravel (jika tersedia) akan digunakan; jika tidak,
 * fallback ke validasi dummy lokal agar app tetap bisa berjalan
 * tanpa perlu setup backend.
 *
 * Akun demo: demo@producthub.test / Demo@1234
 */

import apiClient from './apiClient.js';

/** Akun demo yang valid — disimpan di frontend untuk simulasi login. */
const DEMO_ACCOUNTS = [
  {
    email: 'demo@producthub.test',
    password: 'Demo@1234',
    user: { id: 1, name: 'Demo Admin', email: 'demo@producthub.test', role: 'admin' },
  },
  {
    email: 'user@producthub.test',
    password: 'User@1234',
    user: { id: 2, name: 'Demo User', email: 'user@producthub.test', role: 'user' },
  },
];

/**
 * Melakukan login.
 *
 * Urutan:
 * 1. Coba ke backend Laravel (jika tersedia).
 * 2. Jika backend tidak dapat dihubungi, gunakan validasi dummy lokal.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 * @throws {Error} Jika kredensial salah
 */
export async function login(email, password) {
  // --- Coba backend terlebih dahulu ---
  try {
    const data = await apiClient.post('/api/login', { email, password });
    return data;
  } catch (err) {
    // Jika backend tidak dapat dihubungi, gunakan dummy login
    if (err.isNetworkError || err.message?.includes('menghubungi server')) {
      return dummyLogin(email, password);
    }
    // Error lain dari backend (401, validasi) — teruskan ke caller
    throw err;
  }
}

/**
 * Validasi login menggunakan data dummy lokal.
 * Digunakan sebagai fallback ketika backend tidak tersedia.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: object }}
 */
function dummyLogin(email, password) {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.email === email.trim().toLowerCase() && a.password === password
  );

  if (!account) {
    const error = new Error('Email atau password salah.');
    error.status = 401;
    throw error;
  }

  // Buat token simulasi (tidak divalidasi di backend)
  const token = `dummy-token-${Date.now()}`;
  return { token, user: account.user };
}

/**
 * Melakukan logout.
 * Jika backend tersedia, token dicabut di server.
 * Jika tidak, cukup bersihkan state di frontend.
 *
 * @param {string} token
 * @returns {Promise<void>}
 */
export async function logout(token) {
  // Jangan logout dummy token ke backend
  if (token?.startsWith('dummy-token-')) {
    return;
  }

  try {
    await apiClient.post('/api/logout', {}, token);
  } catch {
    // Tetap bersihkan state meski backend gagal
  }
}

/**
 * Mengambil data user yang sedang login.
 *
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function getMe(token) {
  return apiClient.get('/api/me', token);
}
