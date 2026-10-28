/**
 * ManagePage.jsx
 *
 * Halaman manajemen produk — CRUD produk dari backend Laravel.
 * Termasuk statistik, pencarian, filter ketersediaan, dan paginasi.
 *
 * Jika backend tidak tersedia, menampilkan pesan informatif
 * dan tidak crash.
 */

import { useState } from 'react';
import Swal from 'sweetalert2';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProductForm from '../components/ProductForm.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useManageProducts } from '../hooks/useManageProducts.js';
import { formatCurrency } from '../utils/formatCurrency.js';

// ── Kartu statistik kecil ───────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card" style={accent ? { borderTopColor: accent } : {}}>
      <span className="stat-card__value">{value ?? '—'}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

// ── Satu baris produk di tabel ──────────────────────────────────────────
function ProductRow({ product, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const result = await Swal.fire({
      title: 'Hapus Produk?',
      text: `Apakah Anda yakin ingin menghapus "${product.name}"? Data yang dihapus tidak dapat dikembalikan.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setDeleting(true);
      try {
        await onDelete(product.id);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Dihapus!',
          text: `Produk "${product.name}" berhasil dihapus.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message || 'Terjadi kesalahan saat menghapus produk.',
        });
      } finally {
        setDeleting(false);
      }
    }
  }

  return (
    <tr className="product-row">
      <td className="product-row__name">
        <span className="product-row__title">{product.name}</span>
        {product.description && (
          <span className="product-row__desc">{product.description}</span>
        )}
      </td>
      <td>
        <span className="product-row__category">{product.category?.replace(/-/g, ' ')}</span>
      </td>
      <td className="product-row__price">{formatCurrency(product.price)}</td>
      <td>
        <span className={`badge ${product.is_available ? 'badge--green' : 'badge--red'}`}>
          <span className="badge__dot" aria-hidden="true" />
          {product.is_available ? 'Tersedia' : 'Habis'}
        </span>
      </td>
      <td className="product-row__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn--sm btn--danger-ghost"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Menghapus...' : 'Hapus'}
        </button>
      </td>
    </tr>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function ManagePage() {
  const {
    products, meta, stats, loading, error, backendAvailable,
    search, available, page, totalPages,
    setSearch, setAvailable, setPage, retry, remove, refresh,
  } = useManageProducts();

  const [formProduct, setFormProduct] = useState(null); // null = tutup, {} = tambah, {id,...} = edit
  const [showForm, setShowForm] = useState(false);

  function openAdd() { setFormProduct(null); setShowForm(true); }
  function openEdit(p) { setFormProduct(p); setShowForm(true); }
  function closeForm() { setShowForm(false); setFormProduct(null); }
  function onSaved() { closeForm(); refresh(); }

  // Backend tidak tersedia
  if (!backendAvailable) {
    return (
      <DashboardLayout>
        <div className="dashboard">
          <div className="page-header">
            <div>
              <h1 className="dashboard__title">Kelola Produk</h1>
              <p className="dashboard__subtitle">Manajemen produk via backend Laravel</p>
            </div>
          </div>
          <div className="backend-unavailable">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" aria-hidden="true">
              <path d="M5.636 18.364a9 9 0 1 0 12.728 0M12 3v9" />
              <circle cx="12" cy="17" r="1" />
            </svg>
            <h3>Backend tidak terjangkau</h3>
            <p>
              Fitur manajemen produk memerlukan backend Laravel yang berjalan di{' '}
              <code>localhost:8000</code>.
            </p>
            <p>
              Jalankan backend dengan perintah:<br />
              <code>cd backend &amp;&amp; php artisan serve</code>
            </p>
            <button type="button" className="btn btn--primary" onClick={retry}>
              Coba lagi
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="dashboard__title">Kelola Produk</h1>
            <p className="dashboard__subtitle">
              {meta ? `${meta.total} produk di database` : 'Manajemen produk via backend Laravel'}
            </p>
          </div>
          <button type="button" className="btn btn--primary" onClick={openAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk
          </button>
        </div>

        {/* Statistik */}
        {stats && (
          <div className="stats-row">
            <StatCard label="Total Produk" value={stats.total} />
            <StatCard label="Tersedia" value={stats.available} accent="var(--green)" />
            <StatCard label="Stok Habis" value={stats.out_of_stock} accent="var(--red)" />
            <StatCard label="Harga Rata-rata" value={formatCurrency(stats.price?.average)} />
          </div>
        )}

        {/* Filter & Search */}
        <div className="dashboard__toolbar" style={{ marginTop: 'var(--s5)' }}>
          <div className="search-bar">
            <svg className="search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" width="18" height="18">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search" className="search-bar__input"
              placeholder="Cari nama atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="filter-group">
            <select className="form-select" value={available}
              onChange={(e) => setAvailable(e.target.value)} disabled={loading}>
              <option value="">Semua Status</option>
              <option value="1">Tersedia</option>
              <option value="0">Stok Habis</option>
            </select>
          </div>
        </div>

        {/* Tabel produk */}
        {loading && <StatusMessage type="loading" message="Memuat produk..." />}
        {error && <StatusMessage type="error" message={error} onRetry={retry} />}

        {!loading && !error && products.length === 0 && (
          <StatusMessage type="empty" message="Belum ada produk. Tambahkan yang pertama!" />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="table-wrap">
            <table className="product-table" aria-label="Daftar produk">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <ProductRow key={p.id} product={p} onEdit={openEdit} onDelete={remove} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginasi */}
        {!loading && !error && totalPages > 1 && (
          <nav className="pagination" aria-label="Navigasi halaman">
            <button type="button" className="btn btn--secondary"
              onClick={() => setPage(page - 1)} disabled={page === 1}>
              ← Sebelumnya
            </button>
            <span className="pagination__info">{page} / {totalPages}</span>
            <button type="button" className="btn btn--secondary"
              onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              Berikutnya →
            </button>
          </nav>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <ProductForm product={formProduct} onClose={closeForm} onSaved={onSaved} />
      )}
    </DashboardLayout>
  );
}
