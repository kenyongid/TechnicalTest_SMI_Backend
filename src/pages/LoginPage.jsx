/**
 * LoginPage.jsx — Halaman login dengan layout dua kolom.
 * Kiri: visual panel. Kanan: form login.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function getFieldError(errors, field) {
  if (!errors) return null;
  return Array.isArray(errors[field]) ? errors[field][0] : (errors[field] ?? null);
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);

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
    if (validationErrors) { setFieldErrors(validationErrors); return; }

    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.errors) setFieldErrors(err.errors);
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* Panel kiri — visual */}
      <div className="login-visual" aria-hidden="true">
        <div className="login-visual__brand">
          <span className="login-visual__brand-dot" />
          ProductHub
        </div>
        <div className="login-visual__content">
          <h2 className="login-visual__title">
            Temukan produk<br />
            <em>yang kamu cari.</em>
          </h2>
          <p className="login-visual__desc">
            Katalog produk dari seluruh kategori dalam satu tempat.
            Cari, filter, dan eksplorasi ribuan produk dengan mudah.
          </p>
          <div className="login-visual__chips">
            <span className="login-visual__chip">Pencarian real-time</span>
            <span className="login-visual__chip">Filter kategori</span>
            <span className="login-visual__chip">Detail produk</span>
            <span className="login-visual__chip">DummyJSON API</span>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
          Coding Test — Front-End Engineer SMI
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card__header">
            <p className="login-card__eyebrow">Selamat datang</p>
            <h1 className="login-card__title">Masuk ke<br />ProductHub</h1>
            <p className="login-card__subtitle">
              Gunakan akun demo di bawah atau isi sendiri.
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="login-hint">
            <div className="login-hint__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="login-hint__text">
              <strong>Akun Demo</strong>
              <span>Email: </span>
              <span className="login-hint__cred">demo@producthub.test</span>
              <br />
              <span>Password: </span>
              <span className="login-hint__cred">Demo@1234</span>
            </div>
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
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email" type="email" className="form-input"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@producthub.test"
                autoComplete="email" disabled={loading}
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
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password" type="password" className="form-input"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password" disabled={loading}
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
              type="submit" className="btn btn--primary btn--full"
              disabled={loading} aria-busy={loading}
              style={{ marginTop: '0.25rem', padding: '0.75rem' }}
            >
              {loading ? (
                <><span className="btn__spinner" aria-hidden="true" />Memproses...</>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
