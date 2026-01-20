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
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenuManager from './pages/admin/AdminMenuManager';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MenuProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/menu" element={<><Navbar /><Menu /></>} />
              <Route path="/about" element={<><Navbar /><About /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /></>} />
              <Route path="/login" element={<><Navbar /><Login /></>} />
              <Route path="/signup" element={<><Navbar /><Signup /></>} />
              
              {/* User Protected Routes */}
              <Route path="/cart" element={<PrivateRoute><><Navbar /><Cart /></></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><><Navbar /><Checkout /></></PrivateRoute>} />
              <Route path="/order-confirmation/:orderId" element={<PrivateRoute><><Navbar /><OrderConfirmation /></></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><><Navbar /><UserDashboard /></></PrivateRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              {/* Frontend-only simulation (no backend) */}
              <Route path="/admin/menu-manager" element={<><Navbar /><AdminMenuManager /></>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </MenuProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

