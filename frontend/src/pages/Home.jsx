import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

const FoodJourney = () => {
  const containerRef = useRef(null);

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
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f5f5' width='300' height='300'/%3E%3Ccircle cx='150' cy='130' r='50' fill='%23ff6b6b'/%3E%3Ccircle cx='150' cy='180' r='35' fill='%23feca57'/%3E%3Cpath d='M 120 100 Q 150 80 180 100' stroke='%234ecdc4' stroke-width='3' fill='none'/%3E%3Ccircle cx='140' cy='140' r='5' fill='%23fff'/%3E%3Ccircle cx='160' cy='135' r='4' fill='%23fff'/%3E%3C/svg%3E" 
            alt="Appetizer" 
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Appetizer</h2>
          <p className="food-description">Start your culinary journey with a delightful appetizer to awaken your taste buds</p>
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
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f5f5' width='300' height='300'/%3E%3Cellipse cx='150' cy='140' rx='60' ry='40' fill='%23ff8c42'/%3E%3Cellipse cx='130' cy='180' rx='30' ry='12' fill='%2334a853'/%3E%3Cellipse cx='170' cy='185' rx='28' ry='10' fill='%234caf50'/%3E%3Ccircle cx='130' cy='165' r='6' fill='%23d32f2f'/%3E%3Ccircle cx='160' cy='168' r='5' fill='%23ff6f00'/%3E%3Cpath d='M 200 130 Q 210 120 220 130' stroke='%23ffd700' stroke-width='2' fill='none'/%3E%3C/svg%3E" 
            alt="Main Course" 
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Main Course</h2>
          <p className="food-description">Savor the perfectly cooked main dish with fresh accompaniments and rich flavors</p>
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
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f5f5' width='300' height='300'/%3E%3Cellipse cx='140' cy='170' rx='40' ry='15' fill='%2334a853'/%3E%3Cellipse cx='160' cy='175' rx='35' ry='12' fill='%234caf50'/%3E%3Cellipse cx='180' cy='170' rx='30' ry='10' fill='%2366bb6a'/%3E%3Ccircle cx='130' cy='155' r='7' fill='%23d32f2f'/%3E%3Ccircle cx='165' cy='158' r='6' fill='%23ff6f00'/%3E%3Ccircle cx='185' cy='160' r='5' fill='%23ffd700'/%3E%3Cpath d='M 210 140 Q 220 130 230 140' stroke='%23ffd700' stroke-width='2' fill='none'/%3E%3C/svg%3E" 
            alt="Side Dish" 
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Side Dish</h2>
          <p className="food-description">A healthy salad mixed with light sliced meat to complement your meal</p>
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
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f5f5f5' width='300' height='300'/%3E%3Cpath d='M 120 140 L 180 140 L 172 200 L 128 200 Z' fill='%23d4a574'/%3E%3Cpath d='M 120 140 L 132 120 L 168 120 L 180 140 Z' fill='%238b6f47'/%3E%3Cpath d='M 132 120 L 140 105 L 160 105 L 168 120 Z' fill='%23654321'/%3E%3Cpath d='M 135 155 L 165 155 L 161 185 L 139 185 Z' fill='%23f4e4c1' opacity='0.7'/%3E%3Cline x1='180' y1='160' x2='205' y2='160' stroke='%23c0c0c0' stroke-width='2'/%3E%3Cline x1='184' y1='168' x2='200' y2='156' stroke='%23c0c0c0' stroke-width='2'/%3E%3C/svg%3E" 
            alt="Dessert" 
            className="plate-image"
          />
        </div>
        <div className="food-content">
          <h2 className="food-title">Dessert</h2>
          <p className="food-description">Finish your kitchen experience with a cake to cleanse your mouth</p>
        </div>
        <div className="flour-decoration">
          <div className="flour-dot" style={{ width: '5px', height: '5px', top: '35px', right: '-33px' }}></div>
          <div className="flour-dot" style={{ width: '4px', height: '4px', top: '55px', right: '-42px' }}></div>
          <div className="flour-dot" style={{ width: '6px', height: '6px', top: '75px', right: '-28px' }}></div>
        </div>
      </div>
    </div>
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

      {/* Food Journey Section */}
      <section className="food-journey-section" style={{ padding: '80px 20px', overflowX: 'hidden' }}>
        <style>{`
          .food-journey-section {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            font-family: 'Georgia', serif;
          }

          .journey-container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
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
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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

          .plate-circle:hover {
            box-shadow: 0 25px 80px rgba(212, 175, 55, 0.4);
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

