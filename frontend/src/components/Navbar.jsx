import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartItemCount();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // close mobile menu when route changes via navigate()
    return () => setMobileOpen(false);
  }, []);

  const linkBase =
    'text-sm font-medium text-gray-100/80 hover:text-csk-yellow transition-colors';
  const activeLink = 'text-white';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-gradient-to-r from-[#0d0d10]/95 via-[#111118]/95 to-[#0b0b0f]/95 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/csk-logo.png"
              alt="CSK Food Truck logo"
              className="h-10 w-auto md:h-11 object-contain"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold text-white">
                CSK Food Truck
              </div>
              <div className="text-xs text-white/70">Chicken Shawarma & Kebab</div>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <NavLink to="/" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`}>
              Home
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`}>
              About Us
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`}>
              Menu
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`}>
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/cart" className="relative inline-flex items-center gap-2 text-sm font-medium text-gray-100/80 hover:text-csk-yellow transition">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-csk-yellow text-[#0b0b0f] text-[11px] font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-soft">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-100/80 hover:text-csk-yellow transition"
              aria-label="User Dashboard"
            >
              <FiUser />
            </NavLink>

            {user ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-100/80 hover:text-csk-yellow transition"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className={({ isActive }) => `${linkBase} ${isActive ? activeLink : ''}`}>
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 shadow-soft ring-1 ring-white/15 text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-xl bg-[#111118] shadow-soft ring-1 ring-white/10 p-3 flex flex-col gap-1">
              <NavLink to="/" className="rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/about" className="rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                About Us
              </NavLink>
              <NavLink to="/menu" className="rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                Menu
              </NavLink>
              <NavLink to="/contact" className="rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>
                Contact
              </NavLink>

              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                <NavLink to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-white/90" onClick={() => setMobileOpen(false)}>
                  <FiShoppingCart /> Cart
                  {cartCount > 0 && (
                <span className="ml-1 bg-csk-yellow text-[#0b0b0f] text-[11px] font-semibold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/90"
                  onClick={() => setMobileOpen(false)}
                  aria-label="User Dashboard"
                >
                  <FiUser />
                </NavLink>

                {user ? (
                  <button onClick={handleLogout} className="inline-flex items-center gap-2 text-sm font-medium text-csk-charcoal/80 hover:text-csk-charcoal">
                    <FiLogOut /> Logout
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <NavLink to="/login" className="text-sm font-medium text-csk-charcoal/80 hover:text-csk-charcoal" onClick={() => setMobileOpen(false)}>
                      Login
                    </NavLink>
                    <NavLink
                      to="/signup"
                      className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

