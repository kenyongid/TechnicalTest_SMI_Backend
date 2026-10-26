/**
 * ProductGrid.jsx
 *
 * Grid responsif yang menampilkan daftar ProductCard.
 * Menerima handler state dari parent (DashboardPage).
 */

import ProductCard from './ProductCard.jsx';
import StatusMessage from './StatusMessage.jsx';

export default function ProductGrid({ products, loading, error, onRetry, onSelectProduct }) {
  if (loading) {
    return <StatusMessage type="loading" message="Memuat produk..." />;
  }

  if (error) {
    return <StatusMessage type="error" message={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return <StatusMessage type="empty" message="Tidak ada produk yang sesuai." />;
  }

  return (
    <div className="product-grid" role="list" aria-label="Daftar produk">
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} onClick={onSelectProduct} />
        </div>
      ))}
    </div>
  );
}
