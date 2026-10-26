/**
 * SearchBar.jsx
 *
 * Input pencarian produk dengan debounce sederhana.
 * Menggunakan controlled input agar bisa di-reset dari parent.
 */

import { useEffect, useRef } from 'react';

const DEBOUNCE_MS = 400;

export default function SearchBar({ value, onChange, disabled }) {
  const timerRef = useRef(null);
  // Gunakan ref untuk local display value agar tidak memicu effect cascade
  const inputRef = useRef(null);

  // Sync input DOM jika value dari parent berubah (misalnya direset oleh filter kategori)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== (value ?? '')) {
      inputRef.current.value = value ?? '';
    }
  }, [value]);

  function handleChange(e) {
    const newVal = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(newVal);
    }, DEBOUNCE_MS);
  }

  function handleClear() {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    clearTimeout(timerRef.current);
    onChange('');
  }

  // Cleanup timer saat unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="search-bar">
      <label htmlFor="product-search" className="sr-only">
        Cari produk
      </label>
      <svg
        className="search-bar__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        width="18"
        height="18"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        ref={inputRef}
        id="product-search"
        type="search"
        className="search-bar__input"
        placeholder="Cari produk..."
        defaultValue={value ?? ''}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
      />
      <button
        type="button"
        className="search-bar__clear"
        onClick={handleClear}
        aria-label="Hapus pencarian"
        style={{ visibility: value ? 'visible' : 'hidden' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
