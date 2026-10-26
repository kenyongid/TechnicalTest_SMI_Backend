/**
 * useProducts.js
 *
 * Hook untuk mengelola state dan pengambilan data produk.
 * Menangani loading, error, pencarian, filter kategori, dan paginasi.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../services/productService.js';

const PAGE_SIZE = 20;

/**
 * @returns {{
 *   products: object[],
 *   total: number,
 *   loading: boolean,
 *   error: string|null,
 *   query: string,
 *   category: string,
 *   page: number,
 *   totalPages: number,
 *   categories: object[],
 *   categoriesLoading: boolean,
 *   setQuery: (q: string) => void,
 *   setCategory: (c: string) => void,
 *   setPage: (p: number) => void,
 *   retry: () => void,
 * }}
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQueryState] = useState('');
  const [category, setCategoryState] = useState('');
  const [page, setPageState] = useState(1);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Ref untuk AbortController agar tidak terjadi race condition
  const abortRef = useRef(null);
  // Ref untuk trigger retry
  const [retryKey, setRetryKey] = useState(0);

  // Muat kategori sekali saat mount
  useEffect(() => {
    const controller = new AbortController();

    function fetchCategories() {
      getCategories({ signal: controller.signal })
        .then((data) => {
          setCategories(data);
          setCategoriesLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // Gagal muat kategori tidak fatal; grid tetap ditampilkan
            console.error('Gagal memuat kategori:', err.message);
            setCategoriesLoading(false);
          }
        });
    }

    fetchCategories();

    return () => controller.abort();
  }, []);

  // Muat produk setiap kali query/category/page berubah
  useEffect(() => {
    // Batalkan request sebelumnya
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const skip = (page - 1) * PAGE_SIZE;

    let fetchFn;
    if (query.trim()) {
      fetchFn = searchProducts({ query: query.trim(), limit: PAGE_SIZE, skip, signal: controller.signal });
    } else if (category) {
      fetchFn = getProductsByCategory({ category, limit: PAGE_SIZE, skip, signal: controller.signal });
    } else {
      fetchFn = getProducts({ limit: PAGE_SIZE, skip, signal: controller.signal });
    }

    function runFetch() {
      setLoading(true);
      setError(null);

      fetchFn
        .then((data) => {
          setProducts(data.products ?? []);
          setTotal(data.total ?? 0);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          setError(err.message);
          setProducts([]);
          setTotal(0);
          setLoading(false);
        });
    }

    runFetch();

    return () => controller.abort();
  }, [query, category, page, retryKey]);

  const setQuery = useCallback((q) => {
    setQueryState(q);
    setPageState(1);
  }, []);

  const setCategory = useCallback((c) => {
    setCategoryState(c);
    setPageState(1);
    setQueryState('');
  }, []);

  const setPage = useCallback((p) => setPageState(p), []);

  const retry = useCallback(() => {
    setError(null);
    setRetryKey((k) => k + 1);
  }, []);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    products,
    total,
    loading,
    error,
    query,
    category,
    page,
    totalPages,
    categories,
    categoriesLoading,
    setQuery,
    setCategory,
    setPage,
    retry,
  };
}
