/**
 * Navbar.jsx — Navigasi atas dengan dua menu: Katalog dan Kelola Produk.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__left">
          <span className="navbar__brand" aria-label="ProductHub">
            <span className="navbar__brand-dot" aria-hidden="true" />
            ProductHub
          </span>

          <nav className="navbar__nav" aria-label="Menu utama">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              Katalog
            </NavLink>
            <NavLink
              to="/manage"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              Kelola Produk
            </NavLink>
          </nav>
        </div>

        <div className="navbar__actions">
          {user && (
            <div className="navbar__user">
              <div className="navbar__user-avatar" aria-hidden="true">{initials}</div>
              <span>{user.name}</span>
            </div>
          )}
          <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" aria-hidden="true">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
