import { useMemo, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';

const Menu = () => {
  const { items: menuItems, categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!activeCategory) return [];
    return menuItems.filter((i) => i.category === activeCategory);
  }, [activeCategory, menuItems]);

  const onAdd = async (id) => {
    // If backend/auth isn’t set up, still keep the UI flow clean.
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(id, 1);
  };

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Menu</h1>
          <p className="mt-4 text-csk-text">
            Browse our categories and add your favorites to cart. Crafted for a warm, premium food experience.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2.5 rounded-full transition shadow-soft ring-1 ring-black/5 ${
                activeCategory === c
                  ? 'bg-csk-yellow text-csk-charcoal'
                  : 'bg-white text-csk-charcoal/80 hover:bg-csk-cream'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Cards */}
        {categories.length === 0 ? (
          <div className="mt-10 bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-8 text-center">
            <h2 className="font-heading text-2xl font-semibold text-csk-charcoal">No menu items yet</h2>
            <p className="mt-2 text-sm text-csk-text">
              Add items from the Admin Menu Manager (frontend simulation) to populate user categories dynamically.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((food) => (
              <div
                key={food.id}
                className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-lift transition transform hover:-translate-y-1"
              >
                <img src={food.image} alt={food.name} className="w-full h-52 object-cover" loading="lazy" />
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-csk-charcoal">{food.name}</h3>
                  <p className="mt-2 text-sm text-csk-text">{food.description}</p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-2xl font-bold text-csk-charcoal">₹{food.price}</div>
                    <button
                      type="button"
                      onClick={() => onAdd(food.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-csk-yellow px-5 py-2.5 text-sm font-semibold text-csk-charcoal hover:bg-csk-yellowSoft transition shadow-soft"
                    >
                      <FiShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Menu;


