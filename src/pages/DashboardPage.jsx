/**
 * DashboardPage.jsx — Halaman katalog produk.
 */

import { useState } from 'react';
import ProductGrid from '../components/ProductGrid.jsx';
import ProductModal from '../components/ProductModal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { useProducts } from '../hooks/useProducts.js';

export default function DashboardPage() {
  const {
    products, total, loading, error,
    query, category, page, totalPages,
    categories, categoriesLoading,
    setQuery, setCategory, setPage, retry,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Teks konteks pencarian/filter
  function getSubtitle() {
    if (loading) return 'Memuat produk...';
    if (query) return `Hasil pencarian untuk "${query}"`;
    if (category) {
      const found = categories.find((c) => c.slug === category);
      return `Kategori: ${found?.name ?? category}`;
    }
    return 'Semua produk';
  }

  return (
    <DashboardLayout>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard__header">
          <div>
            <h1 className="dashboard__title">Katalog Produk</h1>
            <p className="dashboard__subtitle">{getSubtitle()}</p>
          </div>
          {!loading && !error && total > 0 && (
            <span className="dashboard__count">
              {total.toLocaleString('id-ID')} produk ditemukan
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="dashboard__toolbar">
          <SearchBar value={query} onChange={setQuery} disabled={loading} />
          <div className="filter-group">
            <label htmlFor="category-filter" className="sr-only">Filter kategori</label>
            <select
              id="category-filter" className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading || categoriesLoading}
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <ProductGrid
          products={products} loading={loading} error={error}
          onRetry={retry} onSelectProduct={setSelectedProduct}
        />

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <nav className="pagination" aria-label="Navigasi halaman">
            <button
              type="button" className="btn btn--secondary"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1} aria-label="Halaman sebelumnya"
            >
              ← Sebelumnya
            </button>
            <span className="pagination__info" aria-current="page">
              {page} / {totalPages}
            </span>
            <button
              type="button" className="btn btn--secondary"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages} aria-label="Halaman berikutnya"
            >
              Berikutnya →
            </button>
          </nav>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </DashboardLayout>
  );
}
