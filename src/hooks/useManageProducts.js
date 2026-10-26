/**
 * useManageProducts.js
 *
 * Hook untuk halaman manajemen produk backend.
 * Menangani state daftar produk, stats, pencarian, filter, dan paginasi.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  deleteProduct,
  fetchProducts,
  fetchStats,
} from '../services/backendProductService.js';

const PAGE_SIZE = 12;

export function useManageProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const [search, setSearchState] = useState('');
  const [available, setAvailableState] = useState('');
  const [page, setPageState] = useState(1);
  const [retryKey, setRetryKey] = useState(0);

  const abortRef = useRef(null);

  // Cek apakah backend tersedia
  useEffect(() => {
    if (!token) return;
    fetchStats(token)
      .then((data) => {
        setStats(data.data);
        setBackendAvailable(true);
      })
      .catch(() => setBackendAvailable(false));
  }, [token, retryKey]);

  // Ambil produk setiap kali filter/page berubah
  useEffect(() => {
    if (!token || !backendAvailable) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    function load() {
      setLoading(true);
      setError(null);

      fetchProducts({ search, available, page, perPage: PAGE_SIZE }, token)
        .then((data) => {
          setProducts(data.data ?? []);
          setMeta(data.meta ?? null);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          setError(err.message);
          setLoading(false);
        });
    }

    load();
    return () => controller.abort();
  }, [token, search, available, page, retryKey, backendAvailable]);

  const setSearch = useCallback((v) => { setSearchState(v); setPageState(1); }, []);
  const setAvailable = useCallback((v) => { setAvailableState(v); setPageState(1); }, []);
  const setPage = useCallback((p) => setPageState(p), []);
  const retry = useCallback(() => { setError(null); setRetryKey((k) => k + 1); }, []);

  // Hapus produk lalu refresh
  const remove = useCallback(async (id) => {
    await deleteProduct(id, token);
    setRetryKey((k) => k + 1);
  }, [token]);

  const totalPages = meta ? meta.last_page : 0;

  return {
    products, meta, stats, loading, error, backendAvailable,
    search, available, page, totalPages,
    setSearch, setAvailable, setPage, retry, remove,
    refresh: () => setRetryKey((k) => k + 1),
  };
}
