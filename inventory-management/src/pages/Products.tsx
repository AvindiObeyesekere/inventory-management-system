import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PackagePlus, Pencil, Trash2, ArrowUpAZ, ArrowDownAZ, Search, Download } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { ProductFormModal } from '@/components/modals/ProductFormModal';
import { storageUtil, type StoredCategory, type StoredProduct } from '@/utils/localStorage';

type ProductFormValues = {
  productName: string;
  category: string;
  metricValue: string;
  price: string;
  stockQuantity: string;
};

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [categories] = useState<StoredCategory[]>(() => storageUtil.getAllCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [editingProduct, setEditingProduct] = useState<StoredProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<StoredProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by category
  const categoryFilteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Filter by search query (product name or SKU)
  const searchedProducts = searchQuery.trim()
    ? categoryFilteredProducts.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categoryFilteredProducts;

  // Sort
  const filteredProducts = sortOrder
    ? [...searchedProducts].sort((a, b) =>
        sortOrder === 'asc'
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName),
      )
    : searchedProducts;

  const {
    paginatedData: paginatedProducts,
    currentPage, totalPages, goToNextPage, goToPreviousPage, goToPage, hasNextPage, hasPreviousPage,
  } = usePagination({ data: filteredProducts, itemsPerPage: 5 });

  useEffect(() => {
    setIsModalOpen(location.pathname === '/products/add');
  }, [location.pathname]);
  useEffect(() => {
    if (currentPage > totalPages) goToPage(1);
  }, [filteredProducts.length]);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    goToPage(1);
  }, [searchQuery, selectedCategory]);

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

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const openEditModal = (product: StoredProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (values: ProductFormValues) => {
    if (editingProduct) {
      const nextProducts = products.map((product) =>
        product.productId === editingProduct.productId
          ? {
              ...product,
              productName: values.productName.trim(),
              category: values.category.trim(),
              metricValue: values.metricValue.trim(),
              price: Number(values.price),
              stockQuantity: values.stockQuantity === '' ? 0 : Number(values.stockQuantity),
            }
          : product,
      );

      setProducts(nextProducts);
      storageUtil.saveProducts(nextProducts);
      closeAddModal();
      return;
    }

    const newProduct: StoredProduct = {
      productName: values.productName.trim(),
      productId: getNextProductId(products),
      sku: storageUtil.getNextSku(products),
      category: values.category.trim(),
      metricValue: values.metricValue.trim(),
      price: Number(values.price),
      stockQuantity: values.stockQuantity === '' ? 0 : Number(values.stockQuantity),
    };

    const nextProducts = [...products, newProduct];
    setProducts(nextProducts);
    storageUtil.saveProducts(nextProducts);
    closeAddModal();
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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold app-heading">Products</h1>
            <p className="mt-1 text-sm app-muted">Track product details and current stock levels.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCsv}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold app-label transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
            >
              <PackagePlus className="h-5 w-5" />
              Add Product
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden app-card">
          <div className="flex flex-col gap-3 border-b app-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold app-heading">Product List</h2>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="app-field pl-9 w-48 sm:w-56"
                />
              </div>

              <span className="text-sm font-medium app-label whitespace-nowrap">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>

              <button
                type="button"
                onClick={toggleSortOrder}
                title={sortOrder === 'asc' ? 'Sorted A-Z' : sortOrder === 'desc' ? 'Sorted Z-A' : 'Sort by name'}
                className="inline-flex items-center gap-2 rounded-md border app-border px-3 py-2 text-sm font-medium app-label transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {sortOrder === 'desc' ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
                {sortOrder === 'asc' ? 'A-Z' : sortOrder === 'desc' ? 'Z-A' : 'Sort'}
              </button>

              <label htmlFor="categoryFilter" className="text-sm font-medium app-label">
                Category
              </label>
              <select
                id="categoryFilter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="app-field"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="app-table-head">
                <tr>
                  <th className="app-th">Product ID</th>
                  <th className="app-th">SKU</th>
                  <th className="app-th">Product Name</th>
                  <th className="app-th">Category</th>
                  <th className="app-th">Price</th>
                  <th className="app-th">Stock Quantity</th>
                  <th className="app-th">Metric Value</th>
                  <th className="app-th">InStock Status</th>
                  <th className="app-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="app-table-body">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? `No products match "${searchQuery}".`
                        : products.length === 0
                          ? 'No products added yet.'
                          : 'No products match this category.'}
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.productId} className="app-row-hover">
                      <td className="app-td-strong">{product.productId}</td>
                      <td className="app-td">{product.sku}</td>
                      <td className="app-td">{product.productName}</td>
                      <td className="app-td">{product.category}</td>
                      <td className="app-td">{product.price.toFixed(2)} Rs</td>
                      <td className="app-td">{product.stockQuantity}</td>
                      <td className="app-td">{product.metricValue || '-'}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.stockQuantity > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                            aria-label={`Update ${product.productName}`}
                            title="Update"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 font-medium text-red-700 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={goToNextPage}
            onPrevious={goToPreviousPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
        onClose={closeAddModal}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={productToDelete !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}" (${productToDelete?.productId})? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleRemoveProduct}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};

// Helper kept here since only Products page needs it
const getNextProductId = (products: StoredProduct[]) => {
  const highestIdNumber = products.reduce((highest, product) => {
    const match = product.productId.match(/^PRD-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `PRD-${String(highestIdNumber + 1).padStart(3, '0')}`;
};