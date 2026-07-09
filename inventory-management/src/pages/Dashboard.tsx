import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, PackagePlus, PackageMinus, LayoutDashboard, TrendingUp, Boxes } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // TODO: replace with real data from product store
  const stats = {
    totalProducts: 0,
    totalInventoryValue: 0,
    totalCategories: 0,
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Overview */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-500">Total Inventory Value</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${stats.totalInventoryValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
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