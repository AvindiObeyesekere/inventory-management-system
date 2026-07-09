import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PackagePlus, Pencil, Trash2, X } from 'lucide-react';
import { storageUtil, type StoredCategory, type StoredProduct } from '@/utils/localStorage';

type ProductFormValues = {
  productName: string;
  category: string;
  metricValue: string;
  price: string;
  stockQuantity: string;
};

const initialValues: ProductFormValues = {
  productName: '',
  category: '',
  metricValue: '',
  price: '',
  stockQuantity: '',
};

const productSchema = Yup.object({
  productName: Yup.string().trim().required('Product name is required'),
  category: Yup.string().trim().required('Category is required'),
  metricValue: Yup.string().trim().required('Metric value is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  stockQuantity: Yup.number()
    .typeError('Stock quantity must be a number')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative'),
});

const getNextProductId = (products: StoredProduct[]) => {
  const highestIdNumber = products.reduce((highest, product) => {
    const match = product.productId.match(/^PRD-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `PRD-${String(highestIdNumber + 1).padStart(3, '0')}`;
};

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [categories] = useState<StoredCategory[]>(() => storageUtil.getAllCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoredProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory);
  const formInitialValues: ProductFormValues = editingProduct
    ? {
        productName: editingProduct.productName,
        category: editingProduct.category,
        metricValue: editingProduct.metricValue ?? '',
        price: String(editingProduct.price),
        stockQuantity: String(editingProduct.stockQuantity),
      }
    : initialValues;

  useEffect(() => {
    setIsModalOpen(location.pathname === '/products/add');
  }, [location.pathname]);

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

  const handleRemoveProduct = (productId: string) => {
    const nextProducts = products.filter((product) => product.productId !== productId);
    setProducts(nextProducts);
    storageUtil.saveProducts(nextProducts);
  };

  return (
    <div className="app-page">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold app-heading">Products</h1>
            <p className="mt-1 text-sm app-muted">Track product details and current stock levels.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
          >
            <PackagePlus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        <div className="mt-6 overflow-hidden app-card">
          <div className="flex flex-col gap-3 border-b app-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold app-heading">Product List</h2>
            <div className="flex items-center gap-3">
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      {products.length === 0 ? 'No products added yet.' : 'No products match this category.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.productId} className="app-row-hover">
                      <td className="app-td-strong">{product.productId}</td>
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
                          onClick={() => handleRemoveProduct(product.productId)}
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
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 px-4">
          <div className="w-full max-w-2xl app-card shadow-xl">
            <div className="flex items-center justify-between border-b app-border px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold app-heading">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </h2>
                {editingProduct && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {editingProduct.productId} / {editingProduct.sku}
                  </p>
                )}
              </div>
              <button
                onClick={closeAddModal}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                aria-label="Close add product modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Formik
              initialValues={formInitialValues}
              enableReinitialize
              validationSchema={productSchema}
              onSubmit={handleSaveProduct}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 px-6 py-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      ['productName', 'Product Name', 'text'],
                      ['metricValue', 'Metric Value', 'text'],
                      ['price', 'Price', 'number'],
                      ['stockQuantity', 'Initial Stock Quantity', 'number'],
                    ].map(([name, label, type]) => (
                      <div key={name} className={name === 'stockQuantity' ? 'sm:col-span-2' : ''}>
                        <label htmlFor={name} className="block text-sm font-medium app-label">
                          {label}
                        </label>
                        <Field
                          id={name}
                          name={name}
                          type={type}
                          className="mt-1 block w-full app-field"
                        />
                        <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                    ))}
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium app-label">
                        Category
                      </label>
                      <Field
                        id="category"
                        name="category"
                        type="text"
                        list="product-category-options"
                        placeholder="Search or select category"
                        className="mt-1 block w-full app-field"
                      />
                      <datalist id="product-category-options">
                        {categories.map((category) => (
                          <option key={category.id} value={category.name} />
                        ))}
                      </datalist>
                      <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t app-border pt-5">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold app-label transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};
