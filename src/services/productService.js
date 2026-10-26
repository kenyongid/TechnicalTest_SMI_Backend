/**
 * productService.js
 *
 * Fungsi pengambilan data produk dari DummyJSON API.
 * Semua data bersumber dari https://dummyjson.com — tidak ada data palsu.
 */

const DUMMYJSON_BASE = 'https://dummyjson.com';

/**
 * Helper fetch ke DummyJSON dengan error handling yang konsisten.
 * @param {string} url
 * @param {AbortSignal} [signal]
 * @returns {Promise<any>}
 */
async function fetchDummy(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error('Tidak dapat menghubungi DummyJSON. Periksa koneksi internet Anda.', { cause: err });
  }

  if (!response.ok) {
    throw new Error(`DummyJSON error: ${response.status} ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Respons produk tidak dapat dibaca.');
  }

  return data;
}

/**
 * Mengambil daftar produk dengan paginasi.
 *
 * @param {{ limit?: number, skip?: number, signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[], total: number, skip: number, limit: number }>}
 */
export async function getProducts({ limit = 20, skip = 0, signal } = {}) {
  const url = `${DUMMYJSON_BASE}/products?limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,rating,stock,description,brand`;
  return fetchDummy(url, signal);
}

/**
 * Mencari produk berdasarkan query.
 *
 * @param {{ query: string, limit?: number, skip?: number, signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[], total: number }>}
 */
export async function searchProducts({ query, limit = 20, skip = 0, signal } = {}) {
  const url = `${DUMMYJSON_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,rating,stock,description,brand`;
  return fetchDummy(url, signal);
}

/**
 * Mengambil daftar kategori yang tersedia.
 *
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<Array<{ slug: string, name: string, url: string }>>}
 */
export async function getCategories({ signal } = {}) {
  return fetchDummy(`${DUMMYJSON_BASE}/products/categories`, signal);
}

/**
 * Mengambil produk berdasarkan kategori.
 *
 * @param {{ category: string, limit?: number, skip?: number, signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[], total: number }>}
 */
export async function getProductsByCategory({ category, limit = 20, skip = 0, signal } = {}) {
  const url = `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}&select=id,title,price,thumbnail,category,rating,stock,description,brand`;
  return fetchDummy(url, signal);
}

/**
 * Mengambil detail satu produk berdasarkan ID.
 *
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<object>}
 */
export async function getProductById(id, { signal } = {}) {
  return fetchDummy(`${DUMMYJSON_BASE}/products/${id}`, signal);
}
