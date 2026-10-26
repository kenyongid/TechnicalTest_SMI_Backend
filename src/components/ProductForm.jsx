/**
 * ProductForm.jsx
 *
 * Modal form untuk tambah dan edit produk backend.
 * Digunakan di ManagePage.
 */

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createProduct, updateProduct } from '../services/backendProductService.js';

const CATEGORIES = [
  'beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration',
  'kitchen-accessories', 'laptops', 'mens-shirts', 'mens-shoes', 'mens-watches',
  'mobile-accessories', 'motorcycle', 'skin-care', 'smartphones', 'sports-accessories',
  'sunglasses', 'tablets', 'tops', 'vehicle', 'womens-bags',
  'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches',
];

const EMPTY = {
  name: '', description: '', price: '', category: '', is_available: true,
};

export default function ProductForm({ product, onClose, onSaved }) {
  const { token } = useAuth();
  const isEdit = !!product;

  const [form, setForm] = useState(
    isEdit
      ? { ...product, price: String(product.price) }
      : EMPTY
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())     errs.name = 'Nama wajib diisi.';
    if (!form.price)           errs.price = 'Harga wajib diisi.';
    else if (isNaN(Number(form.price)) || Number(form.price) < 0)
      errs.price = 'Harga harus angka positif.';
    if (!form.category)        errs.category = 'Kategori wajib dipilih.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setGeneralError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      category: form.category,
      is_available: Boolean(form.is_available),
    };

    try {
      if (isEdit) {
        await updateProduct(product.id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      onSaved();
    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(mapped);
      } else {
        setGeneralError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay" role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal modal--form" role="dialog" aria-modal="true"
        aria-labelledby="form-modal-title">
        <button type="button" className="modal__close" onClick={onClose} aria-label="Tutup form">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="form-modal__inner">
          <h2 id="form-modal-title" className="form-modal__title">
            {isEdit ? 'Edit Produk' : 'Tambah Produk'}
          </h2>

          {generalError && (
            <div className="form-alert" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${errors.name ? 'form-group--error' : ''}`}>
              <label htmlFor="pf-name" className="form-label">Nama Produk</label>
              <input ref={firstFieldRef} id="pf-name" type="text" className="form-input"
                value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="Contoh: iPhone 15 Pro" disabled={loading}
                aria-invalid={!!errors.name} />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="pf-desc" className="form-label">
                Deskripsi <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(opsional)</span>
              </label>
              <textarea id="pf-desc" className="form-input form-textarea"
                value={form.description} onChange={(e) => set('description', e.target.value)}
                placeholder="Deskripsi singkat produk..." disabled={loading}
                rows={3} />
            </div>

            <div className="form-row">
              <div className={`form-group ${errors.price ? 'form-group--error' : ''}`}>
                <label htmlFor="pf-price" className="form-label">Harga (USD)</label>
                <input id="pf-price" type="number" className="form-input"
                  value={form.price} onChange={(e) => set('price', e.target.value)}
                  placeholder="0.00" min="0" step="0.01" disabled={loading}
                  aria-invalid={!!errors.price} />
                {errors.price && <p className="form-error">{errors.price}</p>}
              </div>

              <div className={`form-group ${errors.category ? 'form-group--error' : ''}`}>
                <label htmlFor="pf-cat" className="form-label">Kategori</label>
                <select id="pf-cat" className="form-select"
                  value={form.category} onChange={(e) => set('category', e.target.value)}
                  disabled={loading} aria-invalid={!!errors.category}>
                  <option value="">Pilih kategori...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Status Ketersediaan</span>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${form.is_available ? 'toggle-btn--active' : ''}`}
                  onClick={() => set('is_available', true)}
                  disabled={loading}
                >
                  <span className="toggle-dot toggle-dot--green" aria-hidden="true" />
                  Tersedia
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${!form.is_available ? 'toggle-btn--active-red' : ''}`}
                  onClick={() => set('is_available', false)}
                  disabled={loading}
                >
                  <span className="toggle-dot toggle-dot--red" aria-hidden="true" />
                  Habis
                </button>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn--secondary" onClick={onClose} disabled={loading}>
                Batal
              </button>
              <button type="submit" className="btn btn--primary" disabled={loading} aria-busy={loading}>
                {loading
                  ? <><span className="btn__spinner" aria-hidden="true" />{isEdit ? 'Menyimpan...' : 'Menambahkan...'}</>
                  : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
