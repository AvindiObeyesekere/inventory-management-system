import { useState } from 'react';
import { PackagePlus, Search, ArrowLeft, Boxes } from 'lucide-react';
import { storageUtil, type StoredCategory, type StoredProduct } from '@/utils/localStorage';

export const MobileCategories: React.FC = () => {
  const [categories, setCategories] = useState<StoredCategory[]>(() => storageUtil.getAllCategories());
  const [products] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [selectedCategory, setSelectedCategory] = useState<StoredCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const selectedProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory.name)
    : [];

  const filteredProducts = searchQuery.trim()
    ? selectedProducts.filter(
        (p) =>
          p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : selectedProducts;

  const handleAddCategory = () => {
    const name = categoryName.trim();
    if (!name) return;

    const exists = categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setCategoryError('Category already exists');
      return;
    }

    const newCategory = {
      id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
      name,
      imageUrl: categoryImageUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const nextCategories = [...categories, newCategory];
    setCategories(nextCategories);
    storageUtil.saveCategories(nextCategories);
    setCategoryName('');
    setCategoryImageUrl('');
    setCategoryError('');
    setIsModalOpen(false);
  };

  if (selectedCategory) {
    return (
      <div className="app-page">
        <div className="px-4 py-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-xl font-bold app-heading mb-1">{selectedCategory.name}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="app-field pl-9 w-full"
            />
          </div>

          {/* Product Cards */}
          <div className="space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="app-card p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No products found
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.productId} className="app-card p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{product.productId}</p>
                      <p className="text-sm font-medium app-heading">{product.productName}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        product.stockQuantity > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">SKU</p>
                      <p className="font-medium app-heading">{product.sku}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Stock</p>
                      <p className="font-medium app-heading">{product.stockQuantity}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold app-heading">Categories</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-md bg-purple-700 text-white"
            aria-label="Add Category"
          >
            <PackagePlus className="h-5 w-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="relative h-32 overflow-hidden rounded-lg bg-gray-900 text-left shadow"
            >
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-purple-800 text-white">
                  <Boxes className="h-8 w-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">{category.id}</p>
                <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
                <p className="text-[10px] text-white/80">
                  {products.filter((p) => p.category === category.name).length} products
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm app-card shadow-xl p-6">
            <h3 className="text-base font-semibold app-heading mb-4">Add Category</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium app-label mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="app-field w-full"
                  placeholder="Enter category name"
                />
                {categoryError && <p className="text-xs text-red-600 mt-1">{categoryError}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium app-label mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={categoryImageUrl}
                  onChange={(e) => setCategoryImageUrl(e.target.value)}
                  className="app-field w-full"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-md border app-border px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 rounded-md bg-purple-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};