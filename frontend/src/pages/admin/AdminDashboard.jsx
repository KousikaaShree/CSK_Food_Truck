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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/admin/menu" className="text-gray-700 hover:text-primary-600">
                <FiMenu className="inline mr-1" /> Menu
              </Link>
              <Link to="/admin/orders" className="text-gray-700 hover:text-primary-600">
                <FiShoppingBag className="inline mr-1" /> Orders
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-primary-600">
                <FiLogOut className="inline mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
              </div>
              <FiPackage className="text-4xl text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">₹{stats?.totalRevenue?.toFixed(2) || 0}</p>
              </div>
              <FiDollarSign className="text-4xl text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.todayOrders || 0}</p>
              </div>
              <FiTrendingUp className="text-4xl text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Popular Items</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.popularItems?.length || 0}</p>
              </div>
              <FiMenu className="text-4xl text-purple-500" />
            </div>
          </div>
        </div>

        {stats?.popularItems && stats.popularItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Items</h2>
            <div className="space-y-2">
              {stats.popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.name || 'Unknown'}</span>
                  <span className="font-semibold text-primary-600">{item.count} orders</span>
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

