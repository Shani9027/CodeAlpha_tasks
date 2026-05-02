import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './services/authService';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('amazon_clone_user');
    return stored ? JSON.parse(stored) : null;
  });

  const auth = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('amazon_clone_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('amazon_clone_user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
              <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboardPage /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
