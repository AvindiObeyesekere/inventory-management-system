const USERS_KEY = 'ims_users';
const CURRENT_USER_KEY = 'ims_current_user';
const PRODUCTS_KEY = 'ims_products';
const STOCK_HISTORY_KEY = 'ims_stock_history';
const CATEGORIES_KEY = 'ims_categories';

const DEFAULT_CATEGORIES = [
  {
    name: 'Beverages',
    imageUrl:
      'https://www.shutterstock.com/image-photo/poznan-pol-mar-21-2025-600nw-2605832631.jpg',
  },
  {
    name: 'Electronics',
    imageUrl:
      'https://img.magnific.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg?semt=ais_hybrid&w=740&q=80',
  },
  {
    name: 'Fresh Dairy',
    imageUrl:
      'https://media.istockphoto.com/id/910881428/photo/dairy-products-shot-on-rustic-wooden-table.jpg?s=612x612&w=0&k=20&c=Xh_dDL7XsV0Rff_aIrLOQJ1ZoapugiatmXUxWdo7q2s=',
  },
  {
    name: 'Frozen',
    imageUrl:
      'https://www.ceylonsupermart.com/cdn/shop/collections/e2fe2ee1b387b9c55cefee915e00ea90.jpg?v=1655384860',
  },
  {
    name: 'Rice',
    imageUrl: 'https://spar2u.lk/cdn/shop/files/3000407-1.jpg?v=1748382650&width=533',
  },
];

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

export interface StoredCategory {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
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

  getAllCategories: (): StoredCategory[] => {
    try {
      const categories = localStorage.getItem(CATEGORIES_KEY);

      if (categories) {
        const parsedCategories: StoredCategory[] = JSON.parse(categories);
        let changed = false;
        const categoriesWithImages = parsedCategories.map((category) => {
          const defaultCategory = DEFAULT_CATEGORIES.find(
            (item) => item.name.toLowerCase() === category.name.toLowerCase(),
          );

          if (!category.imageUrl && defaultCategory?.imageUrl) {
            changed = true;
            return { ...category, imageUrl: defaultCategory.imageUrl };
          }

          return category;
        });

        if (changed) {
          localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categoriesWithImages));
        }

        return categoriesWithImages;
      }

      const defaultCategories = DEFAULT_CATEGORIES.map((category, index) => ({
        id: `CAT-${String(index + 1).padStart(3, '0')}`,
        name: category.name,
        imageUrl: category.imageUrl,
        createdAt: new Date().toISOString(),
      }));

      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    } catch {
      return [];
    }
  },

  saveCategories: (categories: StoredCategory[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },
};
