/**
 * ProductModal.jsx — Modal detail produk dengan animasi masuk.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency.js';

function StarRating({ value }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="modal__rating" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i}
          className={`star ${i + 1 <= rounded ? 'star--filled' : 'star--empty'}`}
          viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span>{value?.toFixed(1)}</span>
    </span>
  );
}

export default function ProductModal({ product, onClose }) {
  const [imgError, setImgError] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => { closeRef.current?.focus(); }, []);

  const handleKey = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;

  const { title, price, description, category, rating, stock, brand, images, thumbnail } = product;
  const displayImage = imgError || (!images?.[0] && !thumbnail) ? null : (images?.[0] ?? thumbnail);

  return (
    <div
      className="modal-overlay" role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button
          ref={closeRef} type="button" className="modal__close"
          onClick={onClose} aria-label="Tutup detail produk"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal__content">
          <div className="modal__image-wrap">
            {displayImage ? (
              <img src={displayImage} alt={title} className="modal__img" onError={() => setImgError(true)} />
            ) : (
              <div className="modal__img-fallback" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="56" height="56">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>

          <div className="modal__details">
            <span className="modal__category">{category ?? '—'}</span>
            <h2 id="modal-title" className="modal__title">{title ?? 'Produk tidak diketahui'}</h2>
            {brand && <p className="modal__brand">oleh {brand}</p>}
            <StarRating value={typeof rating === 'number' ? rating : 0} />
            <p className="modal__price">{formatCurrency(price)}</p>
            {description && <p className="modal__description">{description}</p>}
            <div className="modal__meta">
              {typeof stock === 'number' && (
                <span className={`modal__stock ${stock > 0 ? 'modal__stock--in' : 'modal__stock--out'}`}>
                  <span className="modal__stock-dot" aria-hidden="true" />
                  {stock > 0 ? `${stock} unit tersedia` : 'Stok habis'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
