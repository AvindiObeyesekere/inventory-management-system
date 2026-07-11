import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PackageMinus, TrendingUp } from 'lucide-react';
import { storageUtil, type StockHistoryItem, type StoredProduct } from '@/utils/localStorage';

export const MobileStock: React.FC = () => {
  const location = useLocation();
  const initialMode = location.pathname.includes('/stock/deduct') ? 'deduct' : 'restock';
  const [stockAction, setStockAction] = useState<'restock' | 'deduct'>(initialMode);
  const isRestock = stockAction === 'restock';
  const [products, setProducts] = useState<StoredProduct[]>(() => storageUtil.getAllProducts());
  const [history, setHistory] = useState<StockHistoryItem[]>(() => storageUtil.getStockHistory());
  const [stockError, setStockError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleStockUpdate = () => {
    setStockError('');
    const qty = Number(quantity);
    const product = products.find((item) => item.productId === selectedProduct);

    if (!product) {
      setStockError('Select a product');
      return;
    }

    if (!qty || qty < 1) {
      setStockError('Quantity must be at least 1');
      return;
    }

    if (!isRestock && qty > product.stockQuantity) {
      setStockError(`Cannot deduct ${qty} units. Only ${product.stockQuantity} units available.`);
      return;
    }

    const newQuantity = isRestock ? product.stockQuantity + qty : product.stockQuantity - qty;

    if (newQuantity < 0) {
      setStockError('Stock cannot go below 0. Please enter a valid quantity.');
      return;
    }
    const nextProducts = products.map((item) =>
      item.productId === product.productId ? { ...item, stockQuantity: newQuantity } : item,
    );

    const historyItem: StockHistoryItem = {
      id: `${Date.now()}-${product.productId}`,
      productId: product.productId,
      productName: product.productName,
      sku: product.sku ?? '',
      type: stockAction,
      quantity: qty,
      previousQuantity: product.stockQuantity,
      newQuantity,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [historyItem, ...history];
    setProducts(nextProducts);
    setHistory(nextHistory);
    storageUtil.saveProducts(nextProducts);
    storageUtil.saveStockHistory(nextHistory);
    setSelectedProduct('');
    setQuantity('');
  };

  return (
    <div className="app-page">
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold app-heading mb-1">Stock Management</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Increase or decrease stock</p>

        {/* Action Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => { setStockAction('restock'); setStockError(''); }}
            className={`py-2.5 rounded-md text-sm font-semibold transition-colors ${
              isRestock
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-1" />
            Increase
          </button>
          <button
            onClick={() => { setStockAction('deduct'); setStockError(''); }}
            className={`py-2.5 rounded-md text-sm font-semibold transition-colors ${
              !isRestock
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            <PackageMinus className="h-4 w-4 inline mr-1" />
            Decrease
          </button>
        </div>

        {/* Stock Update Form */}
        <div className="app-card p-4 mb-4">
          <h2 className="text-sm font-semibold app-heading mb-3">Update Stock</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium app-label mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="app-field w-full"
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.sku} - {product.productName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium app-label mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="app-field w-full"
                placeholder="Enter quantity"
              />
            </div>
            {stockError && <p className="text-xs text-red-600">{stockError}</p>}
            <button
              onClick={handleStockUpdate}
              disabled={!selectedProduct || !quantity}
              className={`w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                isRestock ? 'bg-emerald-600' : 'bg-orange-600'
              }`}
            >
              {isRestock ? 'Increase Stock' : 'Decrease Stock'}
            </button>
          </div>
        </div>

        {/* Current Stock List */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold app-heading mb-3">Current Stock</h2>
          <div className="space-y-2">
            {products.slice(0, 10).map((product) => (
              <div key={product.productId} className="app-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.sku}</p>
                    <p className="text-sm font-medium app-heading">{product.productName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold app-heading">{product.stockQuantity}</p>
                    <span
                      className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        product.stockQuantity > 0
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold app-heading mb-3">Recent History</h2>
            <div className="space-y-2">
              {history.slice(0, 10).map((item) => (
                <div key={item.id} className="app-card p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.sku}</p>
                      <p className="text-sm font-medium app-heading">{item.productName}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.type === 'restock'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {item.type === 'restock' ? '+' : '-'}{item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};