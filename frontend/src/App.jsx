import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenuManager from './pages/admin/AdminMenuManager';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

function App() {
  return (
    <MenuProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/menu" element={<><Navbar /><Menu /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
              <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
              <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />
              <Route path="/otp-verification" element={<OtpVerification />} />

              {/* User Protected Routes */}
              <Route path="/cart" element={<PrivateRoute><><Navbar /><Cart /><Footer /></></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><><Navbar /><Checkout /><Footer /></></PrivateRoute>} />
              <Route path="/order-confirmation/:orderId" element={<PrivateRoute><><Navbar /><OrderConfirmation /><Footer /></></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><><Navbar /><UserDashboard /><Footer /></></PrivateRoute>} />

              {/* Admin Routes — protected by AdminRoute (role === 'admin') */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/menu-manager" element={<AdminRoute><><Navbar /><AdminMenuManager /><Footer /></></AdminRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </MenuProvider>
  );
}

export default App;

