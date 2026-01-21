import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiPackage, FiDollarSign, FiTrendingUp, FiMenu, FiShoppingBag } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <nav className="bg-gradient-to-r from-[#0d0d10]/95 via-[#111118]/95 to-[#0b0b0f]/95 shadow-soft backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/csk-logo.png"
              alt="CSK Food Truck logo"
              className="h-9 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold text-white">
                CSK Food Truck
              </div>
              <div className="text-xs text-white/70">Admin Dashboard</div>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium text-gray-100/85">
            <Link to="/admin/menu" className="hover:text-csk-yellow flex items-center gap-1">
              <FiMenu /> <span>Menu</span>
            </Link>
            <Link to="/admin/orders" className="hover:text-csk-yellow flex items-center gap-1">
              <FiShoppingBag /> <span>Orders</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</p>
              </div>
              <FiPackage className="text-4xl text-csk-yellow" />
            </div>
          </div>

          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-csk-yellow">₹{stats?.totalRevenue?.toFixed(2) || 0}</p>
              </div>
              <FiDollarSign className="text-4xl text-csk-yellow" />
            </div>
          </div>

          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Orders</p>
                <p className="text-3xl font-bold text-white">{stats?.todayOrders || 0}</p>
              </div>
              <FiTrendingUp className="text-4xl text-csk-yellow" />
            </div>
          </div>

          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Popular Items</p>
                <p className="text-3xl font-bold text-white">{stats?.popularItems?.length || 0}</p>
              </div>
              <FiMenu className="text-4xl text-csk-yellow" />
            </div>
          </div>
        </div>

        {stats?.popularItems && stats.popularItems.length > 0 && (
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="text-xl font-bold text-csk-yellow mb-4">Popular Items</h2>
            <div className="space-y-2">
              {stats.popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-200">{item.name || 'Unknown'}</span>
                  <span className="font-semibold text-csk-yellow">{item.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

