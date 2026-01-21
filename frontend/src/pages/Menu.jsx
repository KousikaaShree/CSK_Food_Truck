import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import FoodCard from '../components/FoodCard';
import CustomizeModal from '../components/CustomizeModal';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    pureVeg: false,
    nonVeg: false,
    bestseller: false
  });
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('/api/foods');
        const foods = res.data || [];
        setMenuItems(foods);

        // Derive category names from populated category field
        const uniqueNames = Array.from(
          new Set(
            foods
              .map((f) => f.category?.name)
              .filter(Boolean)
          )
        );
        setCategories(uniqueNames);
        if (uniqueNames.length > 0 && !activeCategory) {
          setActiveCategory(uniqueNames[0]);
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
      }
    };

    fetchFoods();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = menuItems;

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((i) => i.category?.name === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Filter by bestseller
    if (filters.bestseller) {
      filtered = filtered.filter((item) => item.popular === true);
    }

    // Note: Pure Veg / Non Veg filters would require a 'vegetarian' field in the Food model
    // For now, we'll skip these filters as they're not in the schema
    // If needed, add vegetarian: Boolean to Food model

    return filtered;
  }, [menuItems, activeCategory, searchQuery, filters]);

  const handleCustomize = (food) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedFood(food);
    setShowCustomizeModal(true);
  };

  const handleAddToCart = async (foodId, finalPrice, customizationData) => {
    // For now, add with base price. In production, you'd send customization data to backend
    const result = await addToCart(foodId, 1);
    if (result.success) {
      // You could show a toast notification here
      console.log('Added to cart with customizations:', customizationData);
    }
  };

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const allowedCategories = ['Shawarma', 'Kebab', 'Barbeque', 'Beverages'];
  const availableCategories = categories.filter(cat => allowedCategories.includes(cat));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white pb-20">
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-csk-yellow">Menu</h1>
          <p className="mt-4 text-gray-300">
            Browse our categories and customize your favorites. Crafted for a calm, premium food experience.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for dishes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-[#14151a] border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => toggleFilter('bestseller')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filters.bestseller
                ? 'bg-csk-yellow text-[#0b0b0f] ring-1 ring-csk-yellow/70'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-csk-yellow/50'
            }`}
          >
            ⭐ Bestseller
          </button>
          {/* Pure Veg and Non Veg filters disabled until vegetarian field is added to model */}
          {/* 
          <button
            type="button"
            onClick={() => toggleFilter('pureVeg')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filters.pureVeg
                ? 'bg-green-500/20 text-green-200 ring-1 ring-green-500/50'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-green-500/50'
            }`}
          >
            🥬 Pure Veg
          </button>
          <button
            type="button"
            onClick={() => toggleFilter('nonVeg')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filters.nonVeg
                ? 'bg-red-500/20 text-red-200 ring-1 ring-red-500/50'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-red-500/50'
            }`}
          >
            🍗 Non Veg
          </button>
          */}
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {availableCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2.5 rounded-full transition shadow-soft ring-1 ${
                activeCategory === c
                  ? 'bg-csk-yellow text-[#0b0b0f] ring-csk-yellow/70'
                  : 'bg-[#16161d] text-gray-200 ring-white/10 hover:ring-csk-yellow/50 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cards */}
        {availableCategories.length === 0 ? (
          <div className="mt-10 bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8 text-center">
            <h2 className="font-heading text-2xl font-semibold text-white">No menu items yet</h2>
            <p className="mt-2 text-sm text-gray-300">
              Add items from the Admin Menu Manager to populate user categories dynamically.
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mt-10 bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8 text-center">
            <h2 className="font-heading text-2xl font-semibold text-white">No items found</h2>
            <p className="mt-2 text-sm text-gray-300">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((food) => (
              <FoodCard
                key={food._id}
                image={food.image}
                name={food.name}
                description={food.description}
                price={food.price}
                bestseller={food.popular}
                onCustomize={() => handleCustomize(food)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Menu Button */}
      <button
        onClick={() => setShowCategoryMenu(true)}
        className="fixed bottom-6 right-6 bg-csk-yellow text-[#0b0b0f] w-14 h-14 rounded-full shadow-soft ring-1 ring-csk-yellow/60 hover:bg-csk-yellowSoft transition flex items-center justify-center z-40"
        aria-label="Open category menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Category Menu Overlay */}
      {showCategoryMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#14151a] border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-csk-yellow">Categories</h2>
              <button
                onClick={() => setShowCategoryMenu(false)}
                className="text-gray-400 hover:text-white transition"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {allowedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (availableCategories.includes(cat)) {
                      setActiveCategory(cat);
                    }
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${
                    activeCategory === cat && availableCategories.includes(cat)
                      ? 'bg-csk-yellow/20 text-csk-yellow ring-1 ring-csk-yellow/50'
                      : availableCategories.includes(cat)
                      ? 'bg-[#0f0f14] text-white hover:bg-[#16161d] ring-1 ring-white/10'
                      : 'bg-[#0f0f14] text-gray-500 ring-1 ring-white/5 cursor-not-allowed'
                  }`}
                  disabled={!availableCategories.includes(cat)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat}</span>
                    {availableCategories.includes(cat) && (
                      <span className="text-xs text-gray-400">
                        {menuItems.filter(f => f.category?.name === cat).length} items
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {selectedFood && (
        <CustomizeModal
          food={selectedFood}
          isOpen={showCustomizeModal}
          onClose={() => {
            setShowCustomizeModal(false);
            setSelectedFood(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;
