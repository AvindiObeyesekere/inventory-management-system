import { useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import { PackageMinus, TrendingUp } from 'lucide-react';
import {
  storageUtil,
  type StockHistoryItem,
  type StoredProduct,
} from '@/utils/localStorage';

type StockFormValues = {
  productId: string;
  quantity: string;
};

const stockSchema = Yup.object({
  productId: Yup.string().required('Select a product'),
  quantity: Yup.number()
    .typeError('Quantity must be a number')
    .integer('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
});

export const Stock: React.FC = () => {
  const location = useLocation();
  const mode = location.pathname.includes('/stock/deduct') ? 'deduct' : 'restock';
  const isRestock = mode === 'restock';
  const [products, setProducts] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [history, setHistory] = useState<StockHistoryItem[]>(() => storageUtil.getStockHistory());
  const [stockError, setStockError] = useState('');
  const Icon = isRestock ? TrendingUp : PackageMinus;

  const handleStockUpdate = (values: StockFormValues, { resetForm }: { resetForm: () => void }) => {
    setStockError('');

    const quantity = Number(values.quantity);
    const product = products.find((item) => item.productId === values.productId);

    if (!product) {
      setStockError('Selected product was not found.');
      return;
    }

    if (!isRestock && quantity > product.stockQuantity) {
      setStockError('Deduct quantity cannot be greater than current stock.');
      return;
    }

    const newQuantity = isRestock
      ? product.stockQuantity + quantity
      : product.stockQuantity - quantity;

    const nextProducts = products.map((item) =>
      item.productId === product.productId ? { ...item, stockQuantity: newQuantity } : item,
    );

    const historyItem: StockHistoryItem = {
      id: `${Date.now()}-${product.productId}`,
      productId: product.productId,
      productName: product.productName,
      sku: product.sku ?? '',
      type: mode,
      quantity,
      previousQuantity: product.stockQuantity,
      newQuantity,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [historyItem, ...history];
    setProducts(nextProducts);
    setHistory(nextHistory);
    storageUtil.saveProducts(nextProducts);
    storageUtil.saveStockHistory(nextHistory);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              {isRestock ? 'Increase incoming stock safely.' : 'Decrease outgoing stock safely.'}
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white ${
              isRestock ? 'bg-emerald-600' : 'bg-orange-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            {isRestock ? 'Restock' : 'Deduct Stock'}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Stock</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                        Add products before managing stock.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.productId}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.productName}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{product.stockQuantity}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              product.stockQuantity > 0
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isRestock ? 'Restock Product' : 'Deduct Stock'}
              </h2>
            </div>
            <Formik
              initialValues={{ productId: '', quantity: '' }}
              validationSchema={stockSchema}
              onSubmit={handleStockUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5 px-6 py-5">
                  <div>
                    <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <Field
                      as="select"
                      id="productId"
                      name="productId"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select product</option>
                      {products.map((product) => (
                        <option key={product.productId} value={product.productId}>
                          {product.sku} - {product.productName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="productId" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <Field
                      id="quantity"
                      name="quantity"
                      type="number"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <ErrorMessage name="quantity" component="p" className="mt-1 text-sm text-red-600" />
                  </div>

                  {stockError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{stockError}</p>}

                  <button
                    type="submit"
                    disabled={isSubmitting || products.length === 0}
                    className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                      isRestock ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    {isRestock ? 'Increase Stock' : 'Decrease Stock'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Stock History Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Before</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      No stock changes recorded yet.
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{item.sku}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {item.productName} ({item.productId})
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.type === 'restock'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {item.type === 'restock' ? '+' : '-'}
                          {item.quantity}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{item.previousQuantity}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{item.newQuantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
