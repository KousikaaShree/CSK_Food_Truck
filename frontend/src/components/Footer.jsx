import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiTruck, 
  FiCheckCircle, 
  FiZap, 
  FiShield,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiTwitter,
  FiArrowRight,
  FiHeart
} from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const footerElement = document.getElementById('main-footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => {
      if (footerElement) {
        observer.unobserve(footerElement);
      }
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Special Offers', path: '/menu' },
    { name: 'Reservation', path: '/contact' },
    { name: 'Contact', path: '/contact' },
    { name: 'Gallery', path: '/about' }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: FiInstagram, href: '#' },
    { name: 'Facebook', icon: FiFacebook, href: '#' },
    { name: 'YouTube', icon: FiYoutube, href: '#' },
    { name: 'Twitter', icon: FiTwitter, href: '#' }
  ];

  const features = [
    { icon: FiTruck, title: 'Free Delivery', description: 'On orders above $50' },
    { icon: FiCheckCircle, title: 'Fresh Ingredients', description: '100% quality assured' },
    { icon: FiZap, title: 'Fast Service', description: 'Quick delivery guaranteed' },
    { icon: FiShield, title: 'Hygienic Kitchen', description: 'Safety first always' }
  ];

  return (
    <footer 
      id="main-footer"
      className="relative overflow-hidden bg-gradient-to-br from-[#0b0b0e] via-[#14151a] to-[#121013] border-t border-white/10"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-csk-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-csk-yellowSoft/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8 lg:gap-12 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>

            {/* Brand Section */}
            <div className="lg:col-span-2 xl:col-span-2">
              <Link to="/" className="inline-block mb-6 group">
                <div className="flex items-center gap-3">
                  <img
                    src="/csk-logo.png"
                    alt="CSK Food Truck logo"
                    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="leading-tight">
                    <div className="font-heading text-2xl font-bold text-white group-hover:text-csk-yellow transition-colors duration-300">
                      CSK Food Truck
                    </div>
                    <div className="text-sm text-csk-yellow/80">Chicken Shawarma & Kebab</div>
                  </div>
                </div>
              </Link>
              
              <p className="text-csk-text mb-6 leading-relaxed max-w-sm">
                Serving delicious food with passion. Experience the authentic taste of Middle Eastern cuisine, crafted with love and served fresh from our kitchen to your table.
              </p>

              {/* Social Media */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="group relative"
                      aria-label={social.name}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-csk-yellow group-hover:text-csk-bg group-hover:scale-110 group-hover:shadow-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-csk-yellow/20 scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {navLinks.map((link, index) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-csk-text hover:text-csk-yellow transition-colors duration-300 flex items-center gap-2 group"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-heading text-lg font-semibold text-white mb-6">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-csk-yellow/20 flex items-center justify-center flex-shrink-0 group-hover:bg-csk-yellow transition-colors duration-300">
                    <FiMapPin className="w-4 h-4 text-csk-yellow group-hover:text-csk-bg transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-csk-text text-sm">123 Food Street, Culinary District</p>
                    <p className="text-csk-text text-sm">Chennai, Tamil Nadu 600001</p>
                  </div>
                </div>

                <a 
                  href="tel:+919876543210"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-csk-yellow/20 flex items-center justify-center flex-shrink-0 group-hover:bg-csk-yellow transition-colors duration-300">
                    <FiPhone className="w-4 h-4 text-csk-yellow group-hover:text-csk-bg transition-colors duration-300" />
                  </div>
                  <span className="text-csk-text text-sm group-hover:text-csk-yellow transition-colors duration-300">+91 98765 43210</span>
                </a>

                <a 
                  href="mailto:info@cskfoodtruck.com"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-csk-yellow/20 flex items-center justify-center flex-shrink-0 group-hover:bg-csk-yellow transition-colors duration-300">
                    <FiMail className="w-4 h-4 text-csk-yellow group-hover:text-csk-bg transition-colors duration-300" />
                  </div>
                  <span className="text-csk-text text-sm group-hover:text-csk-yellow transition-colors duration-300">info@cskfoodtruck.com</span>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-csk-yellow/20 flex items-center justify-center flex-shrink-0">
                    <FiClock className="w-4 h-4 text-csk-yellow" />
                  </div>
                  <div>
                    <p className="text-csk-text text-sm font-medium">Working Hours</p>
                    <p className="text-csk-text/80 text-xs">Mon-Fri: 11:00 AM - 11:00 PM</p>
                    <p className="text-csk-text/80 text-xs">Sat-Sun: 10:00 AM - 12:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter & Map */}
            <div className="lg:col-span-2 xl:col-span-2 space-y-8">
              {/* Newsletter */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-white mb-4">Stay Updated</h3>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for exclusive offers"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-csk-yellow focus:bg-white/15 transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-csk-yellow to-csk-yellowSoft text-csk-bg font-semibold rounded-xl hover:shadow-lg hover:shadow-csk-yellow/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubscribed ? 'Subscribed!' : 'Subscribe Now'}
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Map Preview */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-white mb-4">Find Us</h3>
                <div className="relative rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-csk-yellow/20 to-csk-yellowSoft/20 flex items-center justify-center">
                    <div className="text-center">
                      <FiMapPin className="w-8 h-8 text-csk-yellow mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Interactive Map</p>
                      <p className="text-white/70 text-xs">Click to get directions</p>
                    </div>
                  </div>
                  <button className="absolute inset-0 w-full h-full hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="bg-csk-yellow text-csk-bg px-4 py-2 rounded-lg font-medium text-sm">
                      Get Directions
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Special Features */}
          <div className={`mt-16 pt-8 border-t border-white/10 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-csk-yellow/30 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-csk-yellow/20 flex items-center justify-center group-hover:bg-csk-yellow transition-colors duration-300">
                        <Icon className="w-5 h-5 text-csk-yellow group-hover:text-csk-bg transition-colors duration-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                        <p className="text-csk-text/70 text-xs">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-csk-text/80 text-sm text-center md:text-left">
                © 2024 CSK Food Truck. All rights reserved.
              </div>
              
              <div className="flex items-center gap-2 text-csk-text/80 text-sm">
                <span>Designed with</span>
                <FiHeart className="w-4 h-4 text-csk-yellow animate-pulse" />
                <span>by CSK Team</span>
              </div>

              <div className="flex items-center gap-6">
                <Link to="/privacy" className="text-csk-text/80 hover:text-csk-yellow transition-colors duration-300 text-sm">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-csk-text/80 hover:text-csk-yellow transition-colors duration-300 text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
