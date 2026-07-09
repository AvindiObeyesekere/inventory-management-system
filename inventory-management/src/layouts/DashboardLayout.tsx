import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
