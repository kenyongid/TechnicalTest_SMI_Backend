/**
 * StatusMessage.jsx
 *
 * Komponen reusable untuk menampilkan status:
 * loading, error (dengan tombol retry), dan empty state.
 */

export default function StatusMessage({ type, message, onRetry }) {
  if (type === 'loading') {
    return (
      <div className="status-message" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>{message ?? 'Memuat...'}</p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="status-message status-message--error" role="alert">
        <svg className="status-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{message ?? 'Terjadi kesalahan.'}</p>
        {onRetry && (
          <button type="button" className="btn btn--secondary" onClick={onRetry}>
            Coba lagi
          </button>
        )}
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="status-message status-message--empty" role="status">
        <svg className="status-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
        <p>{message ?? 'Tidak ada hasil ditemukan.'}</p>
      </div>
    );
  }

  return null;
}
