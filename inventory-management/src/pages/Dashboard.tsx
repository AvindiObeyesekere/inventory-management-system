import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, PackagePlus, PackageMinus, LayoutDashboard, TrendingUp, Boxes, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { storageUtil } from '@/utils/localStorage';
import companyLogo from '@/assets/logo.png';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const navTabs = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Company', path: '/company' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Help', path: '/help' },
];

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAnalytics, setShowAnalytics] = useState(true);

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

  // Category distribution data for pie chart
  const categoryDistribution = categories
    .map((cat) => ({
      name: cat.name,
      value: products.filter((p) => p.category === cat.name).length,
    }))
    .filter((c) => c.value > 0);

  // Stock distribution data for bar chart (top 10 products by stock)
  const stockDistribution = [...products]
    .sort((a, b) => b.stockQuantity - a.stockQuantity)
    .slice(0, 10)
    .map((p) => ({
      name: p.productName.length > 15 ? p.productName.slice(0, 15) + '…' : p.productName,
      stock: p.stockQuantity,
    }));

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
            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <span className="hidden sm:inline">👋</span>
              <span className="hidden sm:inline truncate max-w-[140px]">{user?.firstName} {user?.lastName}</span>
            </div>
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
            <div className="w-32 flex-shrink-0" />
          </div>
        </div>
        <img
          src={companyLogo}
          alt="Company Logo"
          style={{ height: '140px', width: '200px' }}
          className="absolute top-1/2 right-6 -translate-y-1/2 object-contain"
        />
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* KPI Stats Overview */}
        <div>
          <h2 className="text-lg font-medium app-heading mb-4 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="app-card p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Products</p>
              <p className="mt-1 text-2xl font-bold app-heading">{stats.totalProducts}</p>
            </div>
            <div className="app-card p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Inventory Value</p>
              <p className="mt-1 text-2xl font-bold app-heading">
                {stats.totalInventoryValue.toLocaleString()} Rs
              </p>
            </div>
            <div className="app-card p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categories</p>
              <p className="mt-1 text-2xl font-bold app-heading">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        {/* Toggle Buttons Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowAnalytics(true)}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              showAnalytics
                ? 'border-blue-800 bg-gradient-to-b from-blue-600 via-blue-800 to-blue-950 text-white shadow-md dark:from-slate-950 dark:via-blue-950 dark:to-purple-950'
                : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-900 dark:text-blue-300 dark:hover:border-blue-600 dark:hover:bg-gray-800'
            }`}
          >
            <ChevronsRight className={`h-5 w-5 transition-all duration-300 ${showAnalytics ? 'opacity-0 w-0' : 'animate-bounce'}`} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setShowAnalytics(false)}
            className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              !showAnalytics
                ? 'border-purple-800 bg-gradient-to-b from-purple-600 via-purple-800 to-purple-950 text-white shadow-md dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950'
                : 'border-purple-200 bg-white text-purple-700 hover:border-purple-400 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-300 dark:hover:border-purple-600 dark:hover:bg-gray-800'
            }`}
          >
            <span>Quick Actions</span>
            <ChevronsLeft className={`h-5 w-5 transition-all duration-300 ${!showAnalytics ? 'opacity-0 w-0' : 'animate-bounce'}`} />
          </button>
        </div>

        {/* Horizontal Sliding Container */}
        <div className="overflow-hidden">
          <div
            className={`flex transition-all duration-500 ease-in-out ${
              showAnalytics ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Analytics Panel (left half) */}
            <div className="w-full min-w-0 flex-shrink-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="app-card p-4">
                  <h3 className="text-sm font-semibold app-heading mb-2">Category Distribution</h3>
                  {categoryDistribution.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">No products to show.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent }: { name?: string; percent?: number }) =>
                            `${name ?? ''} ${Math.round((percent ?? 0) * 100)}%`
                          }
                          labelLine={false}
                        >
                          {categoryDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="app-card p-4">
                  <h3 className="text-sm font-semibold app-heading mb-2">Stock Levels (Top 10)</h3>
                  {stockDistribution.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">No products to show.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={stockDistribution} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          interval={0}
                          angle={-20}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Panel (right half) */}
            <div className="w-full min-w-0 flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {actions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className={`${action.color} text-white rounded-lg shadow p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col gap-3`}
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
          </div>
        </div>
      </main>
    </div>
  );
};