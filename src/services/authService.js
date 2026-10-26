/**
 * authService.js
 *
 * Fungsi komunikasi autentikasi dengan backend Laravel.
 * Menggunakan apiClient sebagai lapisan HTTP.
 */

import apiClient from './apiClient.js';

/**
 * Melakukan login ke backend Laravel.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 * @throws {Error} Jika kredensial salah atau server tidak dapat dihubungi
 */
export async function login(email, password) {
  const data = await apiClient.post('/api/login', { email, password });
  return data; // { token, user }
}

/**
 * Melakukan logout dan mencabut token di backend.
 *
 * @param {string} token - Token aktif yang akan dicabut
 * @returns {Promise<void>}
 */
export async function logout(token) {
  await apiClient.post('/api/logout', {}, token);
}

/**
 * Mengambil data user yang sedang login (untuk verifikasi token).
 *
 * @param {string} token
 * @returns {Promise<object>} Data user
 */
export async function getMe(token) {
  return apiClient.get('/api/me', token);
}
