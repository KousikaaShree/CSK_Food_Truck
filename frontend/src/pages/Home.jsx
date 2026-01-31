import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

const FoodJourney = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const foodItems = document.querySelectorAll('.food-item');

    const createFlourPath = (fromElement, toElement) => {
      const fromRect = fromElement.querySelector('.plate-circle').getBoundingClientRect();
      const toRect = toElement.querySelector('.plate-circle').getBoundingClientRect();

      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      const fromY = fromRect.bottom - containerRect.top;
      const toY = toRect.top - containerRect.top;
      const distance = toY - fromY;

      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'flour-particle-path';

        const size = Math.random() * 6 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        const progress = i / particleCount;
        const yPos = fromY + (distance * progress);

        const xOffset = Math.sin(progress * Math.PI * 2) * 30;
        const xPos = 50;

        particle.style.position = 'absolute';
        particle.style.top = yPos + 'px';
        particle.style.left = `calc(${xPos}% + ${xOffset}px)`;
        particle.style.animationDelay = (i * 0.05) + 's';

        container.appendChild(particle);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          setTimeout(() => {
            entry.target.classList.add('rotate-active');

            const currentIndex = parseInt(entry.target.dataset.index);
            if (currentIndex < foodItems.length - 1) {
              createFlourPath(entry.target, foodItems[currentIndex + 1]);
            }
          }, 400);
        }
      });
    }, observerOptions);

    foodItems.forEach(item => observer.observe(item));

    setTimeout(() => {
      foodItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
          item.classList.add('visible');
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="journey-container" ref={containerRef}>
      {/* Food Item 1 - Left */}
      <div className="food-item left" data-index="0">
        <div className="plate-circle">
          <img
            src="/appetizer.png"
            alt="Appetizer"
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Appetizer</h2>
          <p className="food-description">Start with our fresh baked bread with an egg and basil on top</p>
        </div>
        <div className="flour-decoration">
          <div className="flour-dot" style={{ width: '4px', height: '4px', top: '20px', left: '-30px' }}></div>
          <div className="flour-dot" style={{ width: '6px', height: '6px', top: '40px', left: '-40px' }}></div>
          <div className="flour-dot" style={{ width: '3px', height: '3px', top: '60px', left: '-25px' }}></div>
        </div>
      </div>

      {/* Food Item 2 - Right */}
      <div className="food-item right" data-index="1">
        <div className="plate-circle">
          <img
            src="/steak.png"
            alt="Main Dish"
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Main Dish</h2>
          <p className="food-description">Our juicy fresh grilled Steak is served to satisfy your appetite</p>
        </div>
        <div className="flour-decoration">
          <div className="flour-dot" style={{ width: '5px', height: '5px', top: '30px', right: '-35px' }}></div>
          <div className="flour-dot" style={{ width: '4px', height: '4px', top: '50px', right: '-45px' }}></div>
          <div className="flour-dot" style={{ width: '6px', height: '6px', top: '70px', right: '-30px' }}></div>
        </div>
      </div>

      {/* Food Item 3 - Left */}
      <div className="food-item left" data-index="2">
        <div className="plate-circle">
          <img
            src="/salad.png"
            alt="Side Dish"
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Side Dish</h2>
          <p className="food-description">Have a healthy salad mixed with light sliced meat to complement your steak</p>
        </div>
        <div className="flour-decoration">
          <div className="flour-dot" style={{ width: '4px', height: '4px', top: '25px', left: '-28px' }}></div>
          <div className="flour-dot" style={{ width: '5px', height: '5px', top: '45px', left: '-38px' }}></div>
          <div className="flour-dot" style={{ width: '3px', height: '3px', top: '65px', left: '-32px' }}></div>
        </div>
      </div>

      {/* Food Item 4 - Right */}
      <div className="food-item right" data-index="3">
        <div className="plate-circle">
          <img
            src="/dessert.png"
            alt="Dessert"
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Dessert</h2>
          <p className="food-description">Finish your meal with a sweet cake</p>
        </div>
        <div className="flour-decoration">
          <div className="flour-dot" style={{ width: '5px', height: '5px', top: '35px', right: '-33px' }}></div>
          <div className="flour-dot" style={{ width: '4px', height: '4px', top: '55px', right: '-42px' }}></div>
          <div className="flour-dot" style={{ width: '6px', height: '6px', top: '75px', right: '-28px' }}></div>
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
            backgroundColor: '#FFC107',
            color: '#000',
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
            e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 193, 7, 0.4)';
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
            color: '#FFF',
            padding: '14px 40px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.1em',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#FFC107';
            e.currentTarget.style.color = '#FFC107';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.color = '#FFF';
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

      {/* Discover Our Story Section */}
      <section style={{ backgroundColor: '#000', padding: '80px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', maxWidth: '1200px', padding: '40px', backgroundColor: '#FFD700', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px' }}>
            <img 
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800" 
              alt="Delicious Food" 
              style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ flex: '1', minWidth: '300px', maxWidth: '500px', textAlign: 'left' }}>
            <p style={{ color: '#333', fontStyle: 'italic', marginBottom: '10px', fontSize: '16px' }}>Discover</p>
            <h2 style={{ fontSize: '36px', marginBottom: '20px', color: '#333', fontWeight: '600' }}>Our Story</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>
              CSK™ was Conceptualized in 2015 by 3 Engineers from CIT, Coimbatore. The name was inspired from the IPL team CSK (Chennai Super Kings).
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginBottom: '30px' }}>
              Being the fans of cricket and food lovers, we established our first fan based outlet in the name of CSK (Chats, Shakes & Kulfi) at Coimbatore in 2016.
            </p>
            <button
              onClick={() => navigate('/about')}
              style={{
                backgroundColor: '#000',
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
                e.currentTarget.style.backgroundColor = '#333';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#000';
              }}
            >
              More About Us 
              <span style={{ marginLeft: '8px' }}>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Food Journey Section */}
      <section className="food-journey-section" style={{ padding: '80px 5%', overflowX: 'hidden' }}>
        {/* Header Section */}
        <div className="menu-header" style={{ marginBottom: '80px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '40px'
          }}>
            <div style={{ flex: '0 0 auto', textAlign: 'left' }}>
              <h2 style={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: '1.5em',
                color: '#d4af37',
                fontWeight: '300',
                letterSpacing: '2px',
                marginBottom: '10px'
              }}>
                Discover
              </h2>
              <h1 style={{
                fontFamily: "'Georgia', serif",
                fontSize: '3.5em',
                color: '#ffffff',
                fontWeight: '400',
                letterSpacing: '4px',
                lineHeight: '1',
                margin: 0
              }}>
                Our Menu
              </h1>
            </div>
            <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
              <p style={{
                fontFamily: "'Georgia', serif",
                fontSize: '1.1em',
                color: '#b0b0b0',
                lineHeight: '1.8',
                letterSpacing: '0.5px',
                margin: 0
              }}>
                Few things come close to the joy of steak and chips - cooked simply with tender, inviting care. Rest assured that our chefs treat our fresh beef with the respect it deserves. The open kitchens in many of our steakhouses are testimony to this.
              </p>
            </div>
          </div>
        </div>
        <style>{`
          .food-journey-section {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
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

          .flour-particle-path {
            position: absolute;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
            animation: fadeInParticle 0.6s ease-out forwards;
            opacity: 0;
          }

          @keyframes fadeInParticle {
            to { opacity: 1; }
          }

          .food-item {
            display: flex;
            align-items: center;
            margin-bottom: 100px;
            position: relative;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .food-item.visible {
            opacity: 1;
            transform: translateY(0);
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
            background: white;
            box-shadow: 0 25px 80px rgba(212, 175, 55, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            flex-shrink: 0;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
          }

          .food-item.rotate-active .plate-circle {
            transform: rotate(45deg);
          }



          .plate-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .food-item.rotate-active .plate-image {
            transform: rotate(-45deg);
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
            color: #d4af37;
            font-weight: 300;
            letter-spacing: 3px;
            margin-bottom: 20px;
            font-family: 'Brush Script MT', cursive;
          }

          .food-description {
            font-size: 1.2em;
            color: #b0b0b0;
            line-height: 1.8;
            font-weight: 300;
            letter-spacing: 1px;
          }

          .flour-decoration {
            position: absolute;
            pointer-events: none;
          }

          .flour-dot {
            position: absolute;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
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

