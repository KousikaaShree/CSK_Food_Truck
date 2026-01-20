import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { useMenu } from '../context/MenuContext';

const Home = () => {
  const heroVideoSrc = '/videos/hero.mp4';
  const { items: menuItems } = useMenu();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

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
      {/* Hero */}
      <section className="relative h-[78vh] md:h-[86vh] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/csk-logo.png"
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-left text-white animate-[fadeInUp_700ms_ease-out]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/15 mb-6">
                <span className="h-2 w-2 rounded-full bg-csk-yellow" />
                <span className="text-sm text-white/90">Premium street food • Clean & fresh</span>
              </div>

              <h1 className="font-heading text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                Chicken Shawarma & Kebabs
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/85 max-w-xl">
                Warmly grilled, generously filled, and made with quality ingredients. A calm, premium food experience—
                perfect for a quick bite or a full meal.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="#menu-section"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-csk-yellow text-csk-charcoal hover:bg-csk-yellowSoft transition shadow-soft"
                >
                  View Menu <FiArrowRight className="ml-2" />
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/40 hover:ring-white/70 hover:bg-white/10 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured (no filters on Home) */}
      <div id="menu-section" className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-csk-charcoal">
            Today’s Popular Picks
          </h2>
          <p className="mt-3 text-csk-text max-w-2xl mx-auto">
            Handpicked favorites to get you started. Explore the full menu for all categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.slice(0, 4).map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-xl shadow-soft ring-1 ring-black/5 overflow-hidden hover:shadow-lift transition transform hover:-translate-y-1"
            >
              <img src={food.image} alt={food.name} className="w-full h-44 object-cover" loading="lazy" />
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-csk-charcoal">{food.name}</h3>
                <p className="mt-2 text-sm text-csk-text line-clamp-2">{food.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-csk-charcoal">₹{food.price}</span>
                  <button
                    onClick={() => handleAddToCart(food.id)}
                    className="bg-csk-yellow text-csk-charcoal px-4 py-2 rounded-full hover:bg-csk-yellowSoft transition flex items-center gap-2 shadow-soft text-sm font-semibold"
                  >
                    <FiShoppingCart /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-csk-yellow text-csk-charcoal hover:bg-csk-yellowSoft transition shadow-soft"
          >
            View Full Menu <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

