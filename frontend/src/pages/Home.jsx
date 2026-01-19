import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/foods/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === 'all' 
        ? '/api/foods' 
        : `/api/foods?category=${selectedCategory}`;
      const res = await axios.get(url);
      setFoods(res.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (foodId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await addToCart(foodId, 1);
    if (result.success) {
      alert('Added to cart!');
    } else {
      alert(result.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pastel-pink to-pastel-yellow py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to CSK Food Truck
          </h1>
          <p className="text-xl text-gray-600">
            Delicious food delivered to your doorstep
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-pastel-pink'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-2 rounded-full transition ${
                selectedCategory === category.name
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-pastel-pink'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Food Items */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Food+Image';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {food.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {food.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{food.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(food._id)}
                      className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && foods.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No food items found in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

