const USERS_KEY = 'ims_users';
const CURRENT_USER_KEY = 'ims_current_user';
const PRODUCTS_KEY = 'ims_products';
const STOCK_HISTORY_KEY = 'ims_stock_history';

export interface StoredProduct {
  productName: string;
  productId: string;
  sku?: string;
  category: string;
  metricValue?: string;
  price: number;
  stockQuantity: number;
}

export interface StockHistoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'restock' | 'deduct';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  timestamp: string;
}

const getNextSku = (products: StoredProduct[]) => {
  const highestSkuNumber = products.reduce((highest, product) => {
    const match = product.sku?.match(/^SKU-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `SKU-${String(highestSkuNumber + 1).padStart(4, '0')}`;
};

const ensureProductSkus = (products: StoredProduct[]) => {
  let changed = false;
  let highestSkuNumber = products.reduce((highest, product) => {
    const match = product.sku?.match(/^SKU-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  const productsWithSkus = products.map((product) => {
    if (product.sku) {
      return product;
    }

    highestSkuNumber += 1;
    changed = true;
    return { ...product, sku: `SKU-${String(highestSkuNumber).padStart(4, '0')}` };
  });

  return { products: productsWithSkus, changed };
};

export const storageUtil = {
  getAllUsers: () => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  saveUser: (user: any) => {
    const users = storageUtil.getAllUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string) => {
    const users = storageUtil.getAllUsers();
    return users.find((u: any) => u.email === email && !u.deletedAt);
  },

  setCurrentUser: (user: any) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  clearCurrentUser: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getAllProducts: (): StoredProduct[] => {
    try {
      const products = localStorage.getItem(PRODUCTS_KEY);
      const parsedProducts = products ? JSON.parse(products) : [];
      const result = ensureProductSkus(parsedProducts);

      if (result.changed) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(result.products));
      }

      return result.products;
    } catch {
      return [];
    }
  },

  saveProducts: (products: StoredProduct[]) => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  getNextSku,

  getStockHistory: (): StockHistoryItem[] => {
    try {
      const history = localStorage.getItem(STOCK_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  },

  saveStockHistory: (history: StockHistoryItem[]) => {
    localStorage.setItem(STOCK_HISTORY_KEY, JSON.stringify(history));
  },
};
