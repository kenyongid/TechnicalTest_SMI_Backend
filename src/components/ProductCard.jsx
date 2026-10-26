/**
 * ProductCard.jsx
 *
 * Kartu satu produk untuk ditampilkan di grid.
 * Menangani gambar yang gagal dimuat dengan fallback.
 */

import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency.js';

/** Render bintang rating sederhana (readonly). */
function StarRating({ value }) {
  const rounded = Math.round(value * 2) / 2; // Dibulatkan ke 0.5 terdekat
  return (
    <span className="product-card__rating" aria-label={`Rating ${value} dari 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= rounded;
        return (
          <svg
            key={i}
            className={`star ${filled ? 'star--filled' : 'star--empty'}`}
            viewBox="0 0 24 24"
            aria-hidden="true"
            width="14"
            height="14"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
      <span className="rating-value">{value?.toFixed(1) ?? '—'}</span>
    </span>
  );
}

export default function ProductCard({ product, onClick }) {
  const [imgError, setImgError] = useState(false);

  const { title, price, thumbnail, category, rating } = product;

  return (
    <article className="product-card" onClick={() => onClick(product)}>
      <button
        type="button"
        className="product-card__image-btn"
        aria-label={`Lihat detail ${title}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick(product)}
      >
        {imgError || !thumbnail ? (
          <div className="product-card__img-fallback" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="product-card__img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </button>

      <div className="product-card__body">
        <span className="product-card__category">{category ?? '—'}</span>
        <h3 className="product-card__title">{title ?? 'Produk tidak diketahui'}</h3>
        <div className="product-card__footer">
          <StarRating value={typeof rating === 'number' ? rating : 0} />
          <span className="product-card__price">{formatCurrency(price)}</span>
        </div>
      </div>
    </article>
  );
}
