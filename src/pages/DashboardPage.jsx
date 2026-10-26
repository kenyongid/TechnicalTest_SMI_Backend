/**
 * DashboardPage.jsx
 *
 * Halaman utama setelah login.
 * Menampilkan SearchBar, filter kategori, ProductGrid, ProductModal, dan paginasi.
 * Menggunakan useProducts hook untuk pengelolaan state data.
 */

import { useState } from 'react';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductModal from '../components/ProductModal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { useProducts } from '../hooks/useProducts.js';

export default function DashboardPage() {
  const {
    products,
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
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <DashboardLayout>
      <div className="dashboard">
        {/* Toolbar: search + filter */}
        <div className="dashboard__toolbar">
          <SearchBar
            value={query}
            onChange={setQuery}
            disabled={loading}
          />

          <div className="filter-group">
            <label htmlFor="category-filter" className="sr-only">
              Filter kategori
            </label>
            <select
              id="category-filter"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading || categoriesLoading}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid produk */}
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={retry}
          onSelectProduct={setSelectedProduct}
        />

        {/* Paginasi */}
        {!loading && !error && totalPages > 1 && (
          <nav className="pagination" aria-label="Navigasi halaman produk">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
            >
              ← Sebelumnya
            </button>

            <span className="pagination__info" aria-current="page">
              Halaman {page} dari {totalPages}
            </span>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              aria-label="Halaman berikutnya"
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </div>

      {/* Modal detail produk */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </DashboardLayout>
  );
}
