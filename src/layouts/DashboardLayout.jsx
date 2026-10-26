/**
 * DashboardLayout.jsx
 *
 * Layout wrapper untuk halaman yang memerlukan autentikasi.
 * Menyertakan Navbar di atas dan konten halaman di bawah.
 */

import Navbar from '../components/Navbar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" id="main-content">
        {children}
      </main>
    </div>
  );
}
