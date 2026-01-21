import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminMenu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    bestseller: false
  });

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get('/api/admin/foods', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setFoods(res.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/admin/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      console.log('Categories fetched:', res.data);
      // Filter to only allow: Shawarma, Kebab, Barbeque, Beverages
      const allowedCategories = ['Shawarma', 'Kebab', 'Barbeque', 'Beverages'];
      const filtered = (res.data || []).filter(cat => allowedCategories.includes(cat.name));
      setCategories(filtered);
      if (filtered.length === 0) {
        console.warn('No valid categories found. Please ensure categories are seeded: Shawarma, Kebab, Barbeque, Beverages');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error loading categories. Please check console and ensure categories are seeded in database.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        if (key === 'bestseller') {
          // Map bestseller to popular for backend compatibility
          formDataToSend.append('popular', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (editingFood) {
        await axios.put(`/api/admin/foods/${editingFood._id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('/api/admin/foods', formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setShowModal(false);
      setEditingFood(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        available: true,
        bestseller: false
      });
      fetchFoods();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Error saving food item';
      console.error('Save food error:', error?.response?.data || error);
      alert(msg);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category._id || food.category,
      available: food.available,
      bestseller: food.popular || food.bestseller || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/admin/foods/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchFoods();
    } catch (error) {
      alert('Error deleting food item');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <nav className="bg-gradient-to-r from-[#0d0d10]/95 via-[#111118]/95 to-[#0b0b0f]/95 shadow-soft backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/csk-logo.png"
              alt="CSK Food Truck logo"
              className="h-9 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="font-heading text-xl font-bold text-white">
                CSK Food Truck
              </div>
              <div className="text-xs text-white/70">Admin Panel</div>
            </div>
          </Link>
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-gray-100/85 hover:text-csk-yellow transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-csk-yellow">Menu Management</h1>
          <button
            onClick={() => {
              setEditingFood(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                available: true,
                popular: false
              });
              fetchCategories(); // Refresh categories when opening modal
              setShowModal(true);
            }}
            className="bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition flex items-center gap-2 font-semibold shadow-soft ring-1 ring-csk-yellow/60"
          >
            <FiPlus /> Add Food Item
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 overflow-hidden hover:ring-csk-yellow/60 transition"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 ring-2 ring-transparent hover:ring-csk-yellow/70 transition" />
                  <img src={food.image} alt={food.name} className="w-full h-48 object-cover transition duration-300 hover:scale-[1.02]" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{food.name}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-csk-yellow">₹{food.price}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${food.available ? 'bg-csk-yellow/15 text-csk-yellow' : 'bg-[#18181f] text-gray-300'}`}>
                      {food.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="flex-1 bg-csk-yellow text-[#0b0b0f] px-4 py-2 rounded-lg hover:bg-csk-yellowSoft transition flex items-center justify-center gap-2 font-semibold ring-1 ring-csk-yellow/60"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="flex-1 bg-[#18181f] text-gray-200 px-4 py-2 rounded-lg hover:bg-[#23232c] transition flex items-center justify-center gap-2"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#14151a] rounded-2xl p-6 max-w-md w-full mx-4 ring-1 ring-white/10 shadow-soft">
              <h2 className="text-2xl font-bold text-csk-yellow mb-4">
                {editingFood ? 'Edit Food Item' : 'Add Food Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2 font-medium">Category</label>
                  {categories.length === 0 ? (
                    <div className="w-full px-4 py-3 border-2 border-csk-yellow/60 bg-[#18181f] rounded-lg">
                      <p className="text-csk-yellow text-sm font-semibold mb-1">⚠️ No categories found!</p>
                      <p className="text-gray-300 text-xs">
                        Please run this command in backend folder: 
                        <code className="bg-csk-yellow/20 px-2 py-1 rounded ml-1">npm run update:categories</code>
                      </p>
                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="mt-2 text-sm text-csk-yellow underline hover:text-csk-yellow/80"
                      >
                        Click here to refresh
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    required={!editingFood}
                    className="w-full px-4 py-3 border border-white/10 rounded-lg bg-[#0f0f14] text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-[#0f0f14] text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    ✅ Available
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      checked={!formData.available}
                      onChange={(e) => setFormData({ ...formData, available: !e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-[#0f0f14] text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    ❌ Not Available
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-[#0f0f14] text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    ⭐ Bestseller
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-csk-yellow text-[#0b0b0f] py-2 rounded-lg hover:bg-csk-yellowSoft transition font-semibold ring-1 ring-csk-yellow/60"
                  >
                    {editingFood ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingFood(null);
                    }}
                    className="flex-1 bg-[#1d1d25] text-white py-2 rounded-lg hover:bg-[#23232c] transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;

