import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import DesignServices from './pages/DesignServices';
import Login from './pages/Login';
import Register from './pages/Register';

// Customer Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardOrders from './pages/dashboard/DashboardOrders';
import DashboardAppointments from './pages/dashboard/DashboardAppointments';
import DashboardProfile from './pages/dashboard/DashboardProfile';

// Admin Dashboard
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminCustomers from './pages/admin/AdminCustomers';

import AdminContactMessages from './pages/admin/AdminContactMessages';
import AdminChatInbox from './pages/admin/AdminChatInbox';

// Cart & Checkout
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'toast-container',
          duration: 3000,
          style: { background: 'var(--color-charcoal)', color: 'var(--color-white)' },
          success: { iconTheme: { primary: 'var(--color-pink-400)', secondary: 'var(--color-white)' } },
        }}
      />
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:category" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/design-services" element={<DesignServices />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

              {/* Customer Dashboard */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="orders" element={<DashboardOrders />} />
                <Route path="appointments" element={<DashboardAppointments />} />
                <Route path="profile" element={<DashboardProfile />} />
              </Route>

              {/* Admin Dashboard */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="appointments" element={<AdminAppointments />} />
                <Route path="customers" element={<AdminCustomers />} />

                <Route path="contact-messages" element={<AdminContactMessages />} />
                <Route path="chat" element={<AdminChatInbox />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
