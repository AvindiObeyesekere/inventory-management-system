import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Pencil, Trash2, Search, Download } from 'lucide-react';
import { storageUtil, type StoredCategory, type StoredProduct } from '@/utils/localStorage';

export const MobileProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [categories] = useState<StoredCategory[]>(() => storageUtil.getAllCategories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingProduct, setEditingProduct] = useState<StoredProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<StoredProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryFilteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const searchedProducts = searchQuery.trim()
    ? categoryFilteredProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categoryFilteredProducts;

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    navigate('/products/add');
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    navigate('/products');
  };

  const openEditModal = (product: StoredProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleRemoveProduct = () => {
    if (!productToDelete) return;
    const nextProducts = products.filter((product) => product.productId !== productToDelete.productId);
    setProducts(nextProducts);
    storageUtil.saveProducts(nextProducts);
    setProductToDelete(null);
  };

  const exportToCsv = () => {
    const headers = ['Product ID', 'SKU', 'Product Name', 'Category', 'Price (Rs)', 'Stock Quantity', 'Metric Value', 'Status'];
    const rows = products.map((p) => [
      p.productId,
      p.sku ?? '',
      `"${p.productName}"`,
      `"${p.category}"`,
      p.price.toFixed(2),
      p.stockQuantity,
      p.metricValue ?? '',
      p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `products_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-page">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold app-heading">Products</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{searchedProducts.length} items</p>
          </div>
          <button
            onClick={exportToCsv}
            className="p-2 rounded-md border app-border"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="app-field pl-9 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="app-field w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Cards */}
        <div className="space-y-3">
          {searchedProducts.length === 0 ? (
            <div className="app-card p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No products found
            </div>
          ) : (
            searchedProducts.map((product) => (
              <div key={product.productId} className="app-card p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.productId}</p>
                    <h3 className="font-semibold app-heading mt-0.5">{product.productName}</h3>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      product.stockQuantity > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">SKU</p>
                    <p className="font-medium app-heading">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Stock</p>
                    <p className="font-medium app-heading">{product.stockQuantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Price</p>
                    <p className="font-medium app-heading">{product.price.toFixed(2)} Rs</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Category</p>
                    <p className="font-medium app-heading">{product.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setProductToDelete(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Product FAB */}
        <button
          onClick={openAddModal}
          className="fixed bottom-20 right-4 z-40 rounded-full bg-blue-700 p-4 text-white shadow-lg"
          aria-label="Add Product"
        >
          <PackagePlus className="h-6 w-6" />
        </button>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg app-card shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b app-border px-4 py-3">
              <h2 className="text-base font-semibold app-heading">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </h2>
              <button onClick={closeAddModal} className="rounded-full p-1.5 text-gray-500">
                ✕
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); }} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium app-label mb-1">Product Name</label>
                <input
                  type="text"
                  defaultValue={editingProduct?.productName}
                  className="app-field w-full"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium app-label mb-1">Category</label>
                <select className="app-field w-full" defaultValue={editingProduct?.category}>
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium app-label mb-1">Price (Rs)</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.price}
                    className="app-field w-full"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium app-label mb-1">Stock</label>
                  <input
                    type="number"
                    defaultValue={editingProduct?.stockQuantity}
                    className="app-field w-full"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium app-label mb-1">Metric Value</label>
                <input
                  type="text"
                  defaultValue={editingProduct?.metricValue}
                  className="app-field w-full"
                  placeholder="e.g., 1L, 500g"
                />
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {editingProduct ? 'Update' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm app-card shadow-xl p-6">
            <h3 className="text-base font-semibold app-heading mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete "{productToDelete.productName}"? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-md border app-border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveProduct}
                className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};