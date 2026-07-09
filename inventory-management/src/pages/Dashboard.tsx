import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, PackagePlus, PackageMinus, LayoutDashboard, TrendingUp, Boxes } from 'lucide-react';
import { storageUtil } from '@/utils/localStorage';
import companyLogo from '@/assets/logo.png';

const navTabs = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Company', path: '/company' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Help', path: '/help' },
];

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  const actions = [
    {
      title: 'View Products',
      description: 'Browse, search and filter all products',
      icon: Package,
      color: 'bg-blue-600 hover:bg-blue-700',
      path: '/products',
    },
    {
      title: 'Add Product',
      description: 'Create a new product in your inventory',
      icon: PackagePlus,
      color: 'bg-green-600 hover:bg-green-700',
      path: '/products/add',
    },
    {
      title: 'Restock',
      description: 'Increase stock quantity for a product',
      icon: TrendingUp,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      path: '/stock/restock',
    },
    {
      title: 'Sell / Deduct Stock',
      description: 'Decrease stock quantity for a product',
      icon: PackageMinus,
      color: 'bg-orange-600 hover:bg-orange-700',
      path: '/stock/deduct',
    },
    {
      title: 'Categories',
      description: 'Manage and filter by category',
      icon: Boxes,
      color: 'bg-purple-600 hover:bg-purple-700',
      path: '/categories',
    },
  ];

  return (
    <div className="app-page">
      <nav className="app-panel relative overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left - spacer */}
            <div className="w-8 flex-shrink-0" />

            {/* Center - nav tabs */}
            <div className="flex flex-1 items-center justify-center gap-2">
              {navTabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap app-label transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white dark:hover:from-blue-800 dark:hover:to-purple-900"
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {/* Right - empty spacer, logo sits here via absolute positioning */}
            <div className="w-32 flex-shrink-0" />
          </div>
        </div>

        {/* Logo - pinned to top-right corner, independent of navbar height */}
        {/* Logo - pinned to top-right corner, independent of navbar height */}
        <img
          src={companyLogo}
          alt="Company Logo"
          style={{ height: '140px', width: '200px' }}
          className="absolute top-1/2 right-6 -translate-y-1/2 object-contain"
        />
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Overview */}
        <div>
          <h2 className="text-lg font-medium app-heading mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="app-card p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="mt-2 text-3xl font-bold app-heading">{stats.totalProducts}</p>
            </div>
            <div className="app-card p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Inventory Value</p>
              <p className="mt-2 text-3xl font-bold app-heading">
                {stats.totalInventoryValue.toLocaleString()} Rs
              </p>
            </div>
            <div className="app-card p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
              <p className="mt-2 text-3xl font-bold app-heading">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium app-heading mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`${action.color} text-white rounded-lg shadow p-6 text-left transition-colors flex flex-col gap-3`}
                >
                  <Icon className="w-8 h-8" />
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm text-white/80 mt-1">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};