/**
 * Navbar.jsx
 *
 * Navigasi atas aplikasi. Menampilkan nama aplikasi dan tombol logout.
 */

import { useAuth } from '../contexts/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <span className="navbar__brand">ProductHub</span>

        <div className="navbar__actions">
          {user && (
            <span className="navbar__user" aria-label={`Login sebagai ${user.name}`}>
              {user.name}
            </span>
          )}
          <button
            type="button"
            className="btn btn--outline-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
