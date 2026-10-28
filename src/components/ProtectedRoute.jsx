/**
 * ProtectedRoute.jsx
 *
 * Membungkus route yang membutuhkan autentikasi dan pengecekan role.
 * Jika user belum login, redirect ke /login.
 * Jika user tidak memiliki role yang dibutuhkan, redirect ke /.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({
  children,
  requiredRole,
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
