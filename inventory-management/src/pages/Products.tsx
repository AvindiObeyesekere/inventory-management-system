import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { PackagePlus, Trash2, X } from 'lucide-react';
import { storageUtil, type StoredProduct } from '@/utils/localStorage';

type ProductFormValues = {
  productName: string;
  category: string;
  price: string;
  stockQuantity: string;
};

const initialValues: ProductFormValues = {
  productName: '',
  category: '',
  price: '',
  stockQuantity: '',
};

const productSchema = Yup.object({
  productName: Yup.string().trim().required('Product name is required'),
  category: Yup.string().trim().required('Category is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .required('Price is required'),
  stockQuantity: Yup.number()
    .typeError('Stock quantity must be a number')
    .integer('Stock quantity must be a whole number')
    .min(0, 'Stock quantity cannot be negative')
    .required('Stock quantity is required'),
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(location.pathname === '/products/add');
  }, [location.pathname]);

  const openAddModal = () => {
    setIsModalOpen(true);
    navigate('/products/add');
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
    navigate('/products');
  };

  const handleAddProduct = (values: ProductFormValues) => {
    const newProduct: StoredProduct = {
      productName: values.productName.trim(),
      productId: getNextProductId(products),
      category: values.category.trim(),
      price: Number(values.price),
      stockQuantity: Number(values.stockQuantity),
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-sm text-gray-600">Track product details and current stock levels.</p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
          >
            <PackagePlus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stock Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">InStock Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                      No products added yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{product.productId}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.productName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">${product.price.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.stockQuantity}</td>
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
                        <button
                          onClick={() => handleRemoveProduct(product.productId)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 font-medium text-red-700 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Product</h2>
              <button
                onClick={closeAddModal}
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close add product modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={productSchema}
              onSubmit={handleAddProduct}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 px-6 py-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      ['productName', 'Product Name', 'text'],
                      ['category', 'Category', 'text'],
                      ['price', 'Price', 'number'],
                      ['stockQuantity', 'Stock Quantity', 'number'],
                    ].map(([name, label, type]) => (
                      <div key={name} className={name === 'stockQuantity' ? 'sm:col-span-2' : ''}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                          {label}
                        </label>
                        <Field
                          id={name}
                          name={name}
                          type={type}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <ErrorMessage name={name} component="p" className="mt-1 text-sm text-red-600" />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Add Product
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
