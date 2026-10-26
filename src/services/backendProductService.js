/**
 * backendProductService.js
 *
 * Fungsi CRUD produk ke Laravel backend.
 * Berbeda dengan productService.js yang ke DummyJSON (read-only),
 * service ini memerlukan token autentikasi untuk semua operasi.
 */

import apiClient from './apiClient.js';

/**
 * Ambil daftar produk dari backend dengan opsi search, filter, paginasi.
 * @param {{ search?, category?, available?, page?, perPage?, signal? }} opts
 * @param {string} token
 */
export async function fetchProducts(opts = {}, token) {
  const params = new URLSearchParams();
  if (opts.search)    params.set('search', opts.search);
  if (opts.category)  params.set('category', opts.category);
  if (opts.available !== undefined && opts.available !== '')
    params.set('available', opts.available);
  if (opts.page)      params.set('page', opts.page);
  if (opts.perPage)   params.set('per_page', opts.perPage);

  const qs = params.toString();
  return apiClient.get(`/api/products${qs ? `?${qs}` : ''}`, token);
}

/**
 * Ambil statistik produk.
 * @param {string} token
 */
export async function fetchStats(token) {
  return apiClient.get('/api/products/stats', token);
}

/**
 * Tambah produk baru.
 * @param {{ name, description, price, category, is_available }} data
 * @param {string} token
 */
export async function createProduct(data, token) {
  return apiClient.post('/api/products', data, token);
}

/**
 * Update produk berdasarkan ID.
 * @param {number} id
 * @param {object} data
 * @param {string} token
 */
export async function updateProduct(id, data, token) {
  return apiClient.put(`/api/products/${id}`, data, token);
}

/**
 * Hapus produk berdasarkan ID.
 * @param {number} id
 * @param {string} token
 */
export async function deleteProduct(id, token) {
  return apiClient.delete(`/api/products/${id}`, token);
}
