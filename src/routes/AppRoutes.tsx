import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';

// Public Pages
import Home from '@/pages/public/Home';
import Shop from '@/pages/public/Shop';
import ProductDetails from '@/pages/public/ProductDetails';
import Cart from '@/pages/public/Cart';
import Checkout from '@/pages/public/Checkout';
import Wishlist from '@/pages/public/Wishlist';
import LegalPage from '@/pages/public/LegalPage';

// Auth & User Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Account from '@/pages/user/Account';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AddProduct from '@/pages/admin/AddProduct';
import ManageProducts from '@/pages/admin/ManageProducts';
import AdminOrders from '@/pages/admin/AdminOrders';
import LegalEditor from '@/pages/admin/LegalEditor';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="legal/:slug" element={<LegalPage />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected User Account Route */}
        <Route 
          path="account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Admin Routes with Admin Layout */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="legal" element={<LegalEditor />} />
      </Route>
      
      <Route path="*" element={<div className="p-20 text-center font-bold text-red-500">404 - Page Not Found</div>} />
    </Routes>
  );
}