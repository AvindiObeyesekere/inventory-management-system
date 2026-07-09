import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  TrendingUp,
  PackageMinus,
  Boxes,
  LogOut,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Add Product', icon: PackagePlus, path: '/products/add' },
  { label: 'Restock', icon: TrendingUp, path: '/stock/restock' },
  { label: 'Deduct Stock', icon: PackageMinus, path: '/stock/deduct' },
  { label: 'Categories', icon: Boxes, path: '/categories' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Logo / App name + toggle */}
      <div className="px-4 py-6 border-b border-white/10 flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold leading-tight whitespace-nowrap overflow-hidden">
            Inventory<br />Management
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
            collapsed ? 'mx-auto' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={`w-6 h-6 transition-transform duration-300 ease-in-out ${
              collapsed ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-xs text-blue-200">Logged in as</p>
          <p className="text-sm font-medium truncate">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-white text-blue-700'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-red-600 hover:text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};