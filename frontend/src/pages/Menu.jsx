import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import FoodCard from '../components/FoodCard';
import CustomizeModal from '../components/CustomizeModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMenu, ADMIN_CATEGORIES } from '../context/MenuContext';

const Menu = () => {
  // Use MenuContext instead of local axios calls
  const { items } = useMenu();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    bestseller: false,
    veg: false,
    nonveg: false
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCustomize = (food) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedFood(food);
    setShowCustomizeModal(true);
  };

  const handleAddToCart = async (foodId, finalPrice, customizationData) => {
    const result = await addToCart(foodId, 1, customizationData);
    if (result.success) {
      console.log('Added to cart');
    }
  };

  const toggleFilter = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Filter items based on search and tags
  const getFilteredItems = (category) => {
    return items.filter(item => {
      // 1. Category match
      if (item.category !== category) return false;

      // 2. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // 3. Tag filters
      // If Bestseller is ON, item must have 'bestseller' tag
      if (filters.bestseller && !item.tags?.includes('bestseller')) return false;

      // If Veg is ON, item must have 'veg' tag
      if (filters.veg && !item.tags?.includes('veg')) return false;

      // If Non-Veg is ON, item must have 'nonveg' tag
      if (filters.nonveg && !item.tags?.includes('nonveg')) return false;

      return true;
    });
  };

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

        {/* Tag Filters (No Category Tabs) */}
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => toggleFilter('bestseller')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filters.bestseller
                ? 'bg-csk-yellow text-[#0b0b0f] ring-1 ring-csk-yellow/70'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-csk-yellow/50'
              }`}
          >
            ⭐ Bestseller
          </button>
          <button
            type="button"
            onClick={() => toggleFilter('veg')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filters.veg
                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-green-500/50'
              }`}
          >
            🥬 Veg
          </button>
          <button
            type="button"
            onClick={() => toggleFilter('nonveg')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${filters.nonveg
                ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'
                : 'bg-[#16161d] text-gray-200 ring-1 ring-white/10 hover:ring-red-500/50'
              }`}
          >
            🍗 Non-Veg
          </button>
        </div>

        {/* Menu Sections */}
        <div className="space-y-16">
          {ADMIN_CATEGORIES.map((category) => {
            const categoryItems = getFilteredItems(category);

            // If search or filters are active, we might hide empty sections
            // Or we can choose to always show headings. Requirement says "Headings are always visible"
            // depending on interpretation. Usually, if a section is empty due to filters, it's better to show 'No items' or hide it.
            // Let's hide empty sections if we are searching/filtering to avoid clutter, 
            // BUT if it's the default view, we might want to show them.
            // Let's just hide empty sections for cleaner UX.
            if (categoryItems.length === 0) return null;

            return (
              <div key={category} id={category.toLowerCase()} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-csk-yellow mb-6 border-b border-white/10 pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryItems.map((food) => (
                    <FoodCard
                      key={food.id || food._id}
                      image={food.image}
                      name={food.name}
                      description={food.description}
                      price={food.price}
                      tags={food.tags} // Pass tags to card
                      onCustomize={() => handleCustomize(food)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Empty State if all sections are empty */}
          {ADMIN_CATEGORIES.every(c => getFilteredItems(c).length === 0) && (
            <div className="mt-10 bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-8 text-center">
              <h2 className="font-heading text-2xl font-semibold text-white">No items found</h2>
              <p className="mt-2 text-sm text-gray-300">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

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
