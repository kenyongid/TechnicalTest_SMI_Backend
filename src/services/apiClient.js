/**
 * apiClient.js
 *
 * Base HTTP client wrapper menggunakan Fetch API.
 * Menyertakan Authorization header dari token yang diberikan,
 * dan menangani error HTTP secara terpusat.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Membuat request ke backend Laravel.
 *
 * @param {string} path - Path endpoint, misal '/api/login'
 * @param {RequestInit} options - Opsi fetch standar
 * @param {string|null} token - Bearer token untuk endpoint terproteksi
 * @returns {Promise<any>} Data JSON dari respons
 * @throws {Error} Error dengan pesan yang dapat ditampilkan ke user
 */
async function request(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Tidak dapat menghubungi server. Periksa koneksi internet Anda.');
  }

  // Coba parse JSON terlepas dari status code
  let data;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      throw new Error('Respons server tidak dapat dibaca.');
    }
  }

  if (!response.ok) {
    // Gunakan pesan dari API jika tersedia
    const message =
      data?.message ||
      data?.error ||
      `Server error (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.errors = data?.errors ?? null; // Validation errors Laravel
    throw error;
  }

  return data;
}

const apiClient = {
  get: (path, token) => request(path, { method: 'GET' }, token),

  post: (path, body, token) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }, token),

  delete: (path, token) => request(path, { method: 'DELETE' }, token),
};

export default apiClient;
