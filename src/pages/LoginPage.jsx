/**
 * LoginPage.jsx
 *
 * Halaman login. Menangani:
 * - Validasi input sisi frontend
 * - Pemanggilan authService.login via AuthContext
 * - State loading dan pesan error yang jelas
 * - Redirect ke dashboard setelah berhasil login
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function getFieldError(errors, field) {
  if (!errors) return null;
  return Array.isArray(errors[field]) ? errors[field][0] : errors[field] ?? null;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Pesan error umum
  const [fieldErrors, setFieldErrors] = useState(null); // Validation errors dari backend

  const redirectTo = location.state?.from?.pathname ?? '/';

  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Format email tidak valid.';
    if (!password) errs.password = 'Password wajib diisi.';
    return Object.keys(errs).length > 0 ? errs : null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setFieldErrors(null);

    const validationErrors = validate();
    if (validationErrors) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">ProductHub</h1>
          <p className="login-card__subtitle">Masuk untuk melihat katalog produk</p>
        </div>

        {error && (
          <div className="form-alert" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-group ${getFieldError(fieldErrors, 'email') ? 'form-group--error' : ''}`}>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
              aria-describedby={getFieldError(fieldErrors, 'email') ? 'email-error' : undefined}
              aria-invalid={!!getFieldError(fieldErrors, 'email')}
            />
            {getFieldError(fieldErrors, 'email') && (
              <p id="email-error" className="form-error" role="alert">
                {getFieldError(fieldErrors, 'email')}
              </p>
            )}
          </div>

          <div className={`form-group ${getFieldError(fieldErrors, 'password') ? 'form-group--error' : ''}`}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
              aria-describedby={getFieldError(fieldErrors, 'password') ? 'password-error' : undefined}
              aria-invalid={!!getFieldError(fieldErrors, 'password')}
            />
            {getFieldError(fieldErrors, 'password') && (
              <p id="password-error" className="form-error" role="alert">
                {getFieldError(fieldErrors, 'password')}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="btn__spinner" aria-hidden="true" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
