/**
 * NotFoundPage.jsx
 *
 * Halaman 404 untuk route yang tidak ditemukan.
 */

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__msg">Halaman tidak ditemukan.</p>
      <Link to="/" className="btn btn--primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
