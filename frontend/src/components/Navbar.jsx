import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            🍔 CSK Food Truck
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
                  <FiUser /> Dashboard
                </Link>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition flex items-center gap-1">
                  <FiShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                  Cart
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition flex items-center gap-1"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

