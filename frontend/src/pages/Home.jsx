import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

const FoodJourney = () => {
  const navigate = useNavigate();

  return (
    <div className="journey-container">
      {/* Food Item 1 - Left */}
      <div className="food-item left">
        <div className="plate-circle scroll-reveal">
          <img
            src="/assets-koushi-demo/homeshawarma.jpg"
            alt="Shawarma"
            className="plate-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Shawarma</h2>
          <p className="food-description">A flavorful wrap filled with thinly sliced, spiced meat, fresh veggies, and creamy sauces.</p>
        </div>
      </div>

      {/* Food Item 2 - Right */}
      <div className="food-item right">
        <div className="plate-circle scroll-reveal">
          <img
            src="/assets-koushi-demo/homekebab.jpg"
            alt="Kebab"
            className="plate-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Kebab</h2>
          <p className="food-description">Juicy, marinated meat grilled to perfection with rich spices and smoky flavor.
          </p>
        </div>
      </div>

      {/* Food Item 3 - Left */}
      <div className="food-item left">
        <div className="plate-circle scroll-reveal">
          <img
            src="/assets-koushi-demo/homebarbeque.jpg"
            alt="Barbeque"
            className="plate-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Barbeque</h2>
          <p className="food-description">Slow-cooked, smoky grilled dishes infused with bold marinades and charred goodness.</p>
        </div>
      </div>

      {/* Food Item 4 - Right */}
      <div className="food-item right">
        <div className="plate-circle scroll-reveal">
          <img
            src="/assets-koushi-demo/homebrownie.jpg"
            alt="Brownie"
            className="plate-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Brownie</h2>
          <p className="food-description">A rich, fudgy chocolate dessert with a soft, melt-in-the-mouth texture.</p>
        </div>
      </div>


      {/* Bottom CTA Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '60px',
        paddingBottom: '40px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 10
      }}>
        <button
          onClick={() => navigate('/menu')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D97706',
            color: '#fff',
            padding: '14px 40px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1em',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(217, 119, 6, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          View Menu <FiArrowRight style={{ marginLeft: '8px' }} />
        </button>
        <button
          onClick={() => navigate('/cart')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            color: '#D97706',
            padding: '14px 40px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1em',
            border: '1px solid rgba(217, 119, 6, 0.35)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#D97706';
            e.currentTarget.style.color = '#D97706';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.35)';
            e.currentTarget.style.color = '#D97706';
          }}
        >
          Order Now
        </button>
      </div>
    </div >
  );
};

const Home = () => {
  const heroVideoSrc = '/videos/hero.mp4';
  const navigate = useNavigate();
  const revealRootRef = useRef(null);

  useEffect(() => {
    const root = revealRootRef.current;
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll('.scroll-reveal'));
    if (revealEls.length === 0) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target;
        if (el instanceof HTMLElement && el.dataset.revealed === 'true') {
          obs.unobserve(el);
          continue;
        }

        if (el instanceof HTMLElement) {
          el.dataset.revealed = 'true';
          el.classList.add('is-visible');
          obs.unobserve(el);
        }
      }
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    revealEls.forEach((el, idx) => {
      const direction = idx % 2 === 0 ? 'left' : 'right';
      el.setAttribute('data-reveal-direction', direction);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRootRef}
      className="min-h-screen pb-20 bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white"
    >
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

      {/* Discover Our Story Section */}
      <section className="bg-transparent py-12 md:py-20 px-4 md:px-5 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 max-w-7xl p-6 md:p-10 bg-white/5 rounded-xl shadow-sm border border-white/10 w-full">
          <div className="flex-1 w-full max-w-[500px]">
            <img
              src="/assets-koushi-demo/homeaboutus.gif"
              alt="About us"
              className="w-full h-auto rounded-lg shadow-sm scroll-reveal"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex-1 w-full max-w-[500px] text-left">
            <p style={{ color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', marginBottom: '10px', fontSize: '16px' }}>Discover</p>
            <h2 style={{ fontSize: '36px', marginBottom: '20px', color: '#fff', fontWeight: '600' }}>Our Story</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255,255,255,0.78)', marginBottom: '20px' }}>
              CSK™ was Conceptualized in 2015 by 3 Engineers from CIT, Coimbatore. The name was inspired from the IPL team CSK (Chennai Super Kings).
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'rgba(255,255,255,0.78)', marginBottom: '30px' }}>
              Being the fans of cricket and food lovers, we established our first fan based outlet in the name of CSK (Chats, Shakes & Kulfi) at Coimbatore in 2016.
            </p>
            <button
              onClick={() => navigate('/about')}
              style={{
                backgroundColor: '#D97706',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: '500',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#B45309';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#D97706';
              }}
            >
              More About Us
              <span style={{ marginLeft: '8px' }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Food Journey Section */}
      <section className="food-journey-section py-12 md:py-20 px-4 md:px-6 overflow-x-hidden">
        {/* Header Section */}
        <div className="menu-header mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
            <div className="text-left">
              <h2 className="font-heading text-xl md:text-2xl font-light tracking-wider text-amber-400 mb-2">
                Discover
              </h2>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-none">
                Our Menu
              </h1>
            </div>
            <div className="max-w-2xl text-left">
              <p className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed">
                Few things come close to the joy of steak and chips - cooked simply with tender, inviting care. Rest assured that our chefs treat our fresh beef with the respect it deserves. The open kitchens in many of our steakhouses are testimony to this.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          .food-journey-section {
            background: linear-gradient(135deg, #0b0b0e 0%, #101018 60%, #0b0b0e 100%);
            font-family: 'Georgia', serif;
          }

          .journey-container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            padding: 0 40px;
          }

          .path-connector {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            pointer-events: none;
          }

          .path-line {
            position: absolute;
            width: 2px;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
            left: 50%;
            transform: translateX(-50%);
            transition: height 0.3s ease;
          }

          .food-item {
            display: flex;
            align-items: center;
            margin-bottom: 100px;
            position: relative;
          }

          .food-item.left {
            flex-direction: row;
            justify-content: flex-start;
          }

          .food-item.right {
            flex-direction: row-reverse;
            justify-content: flex-start;
          }

          .plate-circle {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: #FFF7E8;
            box-shadow: 0 25px 80px rgba(180, 83, 9, 0.14);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
            transition: box-shadow 0.3s ease;
          }

          /* Scroll reveal (Intersection Observer) */
          .scroll-reveal {
            --reveal-offset: 0px;
            opacity: 0;
            transform: translateX(var(--reveal-offset));
            transition: opacity 1s ease-out, transform 1s ease-out;
            will-change: transform, opacity;
          }

          .scroll-reveal[data-reveal-direction="left"] {
            --reveal-offset: -120px;
          }

          .scroll-reveal[data-reveal-direction="right"] {
            --reveal-offset: 120px;
          }

          .scroll-reveal.is-visible {
            opacity: 1;
            transform: translateX(0);
          }

          .scroll-reveal.is-visible:hover {
            transform: translateX(0) scale(1.02);
          }

          img.scroll-reveal.is-visible:hover {
            filter: brightness(1.05);
          }

          .plate-circle.is-visible:hover .plate-image {
            filter: brightness(1.06);
          }

          @media (max-width: 968px) {
            .scroll-reveal[data-reveal-direction="left"] {
              --reveal-offset: -70px;
            }
            .scroll-reveal[data-reveal-direction="right"] {
              --reveal-offset: 70px;
            }
          }

          @media (max-width: 480px) {
            .scroll-reveal[data-reveal-direction="left"] {
              --reveal-offset: -40px;
            }
            .scroll-reveal[data-reveal-direction="right"] {
              --reveal-offset: 40px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .scroll-reveal {
              opacity: 1;
              transform: none;
              transition: none;
            }
          }

          .plate-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: brightness(1);
          }

          .food-content {
            max-width: 500px;
            padding: 40px;
          }

          .food-item.left .food-content {
            text-align: left;
            margin-left: 60px;
          }

          .food-item.right .food-content {
            text-align: right;
            margin-right: 60px;
          }

          .food-title {
            font-size: 2.8em;
            color: #F59E0B;
            font-weight: 300;
            letter-spacing: 3px;
            margin-bottom: 20px;
            font-family: 'Brush Script MT', cursive;
          }

          .food-description {
            font-size: 1.2em;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.8;
            font-weight: 300;
            letter-spacing: 1px;
          }

          @media (max-width: 968px) {
            .journey-container {
              padding: 0 20px;
            }

            .food-item {
              flex-direction: column !important;
              text-align: center !important;
              margin-bottom: 80px;
            }

            .food-content {
              text-align: center !important;
              margin: 40px 0 0 0 !important;
              padding: 20px;
            }

            .plate-circle {
              width: 250px;
              height: 250px;
            }

            .food-title {
              font-size: 2.2em;
            }

            .food-description {
              font-size: 1.1em;
            }

            .path-line {
              display: none;
            }
          }

          @media (max-width: 480px) {
            .journey-container {
              padding: 0 15px;
            }

            .plate-circle {
              width: 200px;
              height: 200px;
            }

            .food-title {
              font-size: 1.8em;
            }

            .food-description {
              font-size: 1em;
            }
          }
        `}</style>
        <FoodJourney />
      </section>


    </div>
  );
};

export default Home;

