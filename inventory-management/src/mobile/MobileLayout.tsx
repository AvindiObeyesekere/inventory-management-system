import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/mobile/components/BottomNav';

export const MobileLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-950">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};