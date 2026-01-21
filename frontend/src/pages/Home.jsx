import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const heroVideoSrc = '/videos/hero.mp4';
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
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
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 h-full">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-left text-white animate-[fadeInUp_700ms_ease-out]">
              <div className="inline-flex items-center gap-2 rounded-full bg-csk-yellow/15 px-4 py-2 ring-1 ring-csk-yellow/50 mb-6">
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
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
                >
                  View Menu <FiArrowRight className="ml-2" />
                </a>
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 hover:ring-csk-yellow/60 hover:bg-white/5 transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div id="menu-section" className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Order?
          </h2>
          <p className="mt-3 text-gray-300 max-w-2xl mx-auto mb-8">
            Explore our full menu with delicious shawarmas, kebabs, barbeque, and refreshing beverages.
          </p>
          <button
            type="button"
            onClick={() => navigate('/menu')}
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold bg-csk-yellow text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60"
          >
            View Full Menu <FiArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

