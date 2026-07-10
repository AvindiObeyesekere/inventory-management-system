import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Stock } from '@/pages/Stock';
import { Categories } from '@/pages/Categories';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { MobileLayout } from '@/mobile/MobileLayout';
import { MobileDashboard } from '@/mobile/pages/Dashboard';
import { MobileProducts } from '@/mobile/pages/Products';
import { MobileStock } from '@/mobile/pages/Stock';
import { MobileCategories } from '@/mobile/pages/Categories';
import { useIsMobile } from '@/hooks/useIsMobile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with responsive layout */}
        <Route
          element={
            <ProtectedRoute>
              <ResponsiveLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<ResponsivePage desktop={<Dashboard />} mobile={<MobileDashboard />} />} />
          <Route path="/products" element={<ResponsivePage desktop={<Products />} mobile={<MobileProducts />} />} />
          <Route path="/products/add" element={<ResponsivePage desktop={<Products />} mobile={<MobileProducts />} />} />
          <Route path="/stock/restock" element={<ResponsivePage desktop={<Stock />} mobile={<MobileStock />} />} />
          <Route path="/stock/deduct" element={<ResponsivePage desktop={<Stock />} mobile={<MobileStock />} />} />
          <Route path="/categories" element={<ResponsivePage desktop={<Categories />} mobile={<MobileCategories />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const ResponsiveLayout: React.FC = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DashboardLayout />;
};

const ResponsivePage: React.FC<{ desktop: React.ReactNode; mobile: React.ReactNode }> = ({ desktop, mobile }) => {
  const isMobile = useIsMobile();
  return <>{isMobile ? mobile : desktop}</>;
};

export default App;