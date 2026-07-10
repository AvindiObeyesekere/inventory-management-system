import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, PackagePlus, TrendingUp, PackageMinus, Boxes } from 'lucide-react';
import { storageUtil } from '@/utils/localStorage';

const actions = [
  {
    title: 'View Products',
    description: 'Browse all products',
    icon: Package,
    color: 'bg-blue-600',
    path: '/products',
  },
  {
    title: 'Add Product',
    description: 'Create new product',
    icon: PackagePlus,
    color: 'bg-green-600',
    path: '/products/add',
  },
  {
    title: 'Restock',
    description: 'Increase stock',
    icon: TrendingUp,
    color: 'bg-emerald-600',
    path: '/stock/restock',
  },
  {
    title: 'Sell Stock',
    description: 'Decrease stock',
    icon: PackageMinus,
    color: 'bg-orange-600',
    path: '/stock/deduct',
  },
  {
    title: 'Categories',
    description: 'Manage categories',
    icon: Boxes,
    color: 'bg-purple-600',
    path: '/categories',
  },
];

export const MobileDashboard: React.FC = () => {
  const { user } = useAuth();
  const products = storageUtil.getAllProducts();
  const categories = storageUtil.getAllCategories();
  const stats = {
    totalProducts: products.length,
    totalInventoryValue: products.reduce(
      (total, product) => total + product.price * product.stockQuantity,
      0,
    ),
    totalCategories: categories.length,
  };

  return (
    <div className="app-page">
      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">👋 Welcome back,</p>
          <h1 className="text-xl font-bold app-heading">{user?.firstName} {user?.lastName}</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="app-card p-3 text-center">
            <p className="text-lg font-bold app-heading">{stats.totalProducts}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Products</p>
          </div>
          <div className="app-card p-3 text-center">
            <p className="text-lg font-bold app-heading">{stats.totalCategories}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Categories</p>
          </div>
          <div className="app-card p-3 text-center">
            <p className="text-lg font-bold app-heading">{(stats.totalInventoryValue / 1000).toFixed(0)}K</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Value (Rs)</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-sm font-semibold app-heading mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.path}
                to={action.path}
                className={`${action.color} text-white rounded-lg shadow p-4 text-left transition-transform active:scale-95`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-[10px] text-white/80 mt-0.5">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};