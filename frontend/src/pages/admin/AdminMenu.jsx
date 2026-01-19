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
    popular: false
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
      setCategories(res.data || []);
      if (!res.data || res.data.length === 0) {
        console.warn('No categories found in database. Please run: npm run update:categories in backend folder');
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
        formDataToSend.append(key, formData[key]);
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
        popular: false
      });
      fetchFoods();
    } catch (error) {
      alert('Error saving food item');
      console.error(error);
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
      popular: food.popular
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="text-2xl font-bold text-primary-600">
              Admin Panel
            </Link>
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
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
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition flex items-center gap-2"
          >
            <FiPlus /> Add Food Item
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <div key={food._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img src={food.image} alt={food.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{food.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary-600">₹{food.price}</span>
                    <span className={`px-2 py-1 rounded text-xs ${food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {food.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(food)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
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
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {editingFood ? 'Edit Food Item' : 'Add Food Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Category</label>
                  {categories.length === 0 ? (
                    <div className="w-full px-4 py-3 border-2 border-yellow-300 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 text-sm font-semibold mb-1">⚠️ No categories found!</p>
                      <p className="text-yellow-700 text-xs">
                        Please run this command in backend folder: 
                        <code className="bg-yellow-200 px-2 py-1 rounded ml-1">npm run update:categories</code>
                      </p>
                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                      >
                        Click here to refresh
                      </button>
                    </div>
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    required={!editingFood}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    />
                    Popular
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition"
                  >
                    {editingFood ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingFood(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
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

