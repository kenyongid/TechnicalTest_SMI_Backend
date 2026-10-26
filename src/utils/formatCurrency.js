/**
 * formatCurrency.js
 *
 * Fungsi utilitas untuk format harga produk.
 * DummyJSON mengembalikan harga dalam USD.
 */

/**
 * Memformat angka menjadi string mata uang USD.
 *
 * @param {number} amount - Jumlah dalam USD
 * @returns {string} Harga terformat, misal "$29.99"
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
