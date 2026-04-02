import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCartItemCount } from '../utils/cartUtils';

const Navbar = ({ activePage = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // Add a state to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartItemCount());
    // Also update auth state in case it changed in another tab
    const updateAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));

    updateCount();
    
    window.addEventListener('storage', () => {
      updateCount();
      updateAuth();
    });
    window.addEventListener('cartUpdated', updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home on logout
  };

  // Define base items
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services'},
    { label: 'Shop', href: '/shop' },
    { label: 'Cart', href: '/cart' },
  ];

  // Dynamically add Login OR Logout
  const finalNavItems = isLoggedIn 
    ? [...navItems, { label: 'Logout', onClick: handleLogout }] 
    : [...navItems, { label: 'Login', href: '/Authpage' }];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#1a1a1a]/90 backdrop-blur-xl shadow-lg shadow-purple-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="/"
          className="text-2xl font-bold tracking-wider"
          whileHover={{ scale: 1.05 }}
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            FADED
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {finalNavItems.map((item, index) => {
            const isActive = activePage === item.label.toLowerCase();
            
            // Check if it's the Logout button or a standard link
            const isButton = !!item.onClick;

            const content = (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {isButton ? (
                  <button
                    onClick={item.onClick}
                    className="text-sm tracking-wide text-gray-400 hover:text-red-400 transition-colors duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`relative text-sm tracking-wide transition-colors duration-300 group pb-1 ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item.label}
                    {item.label === 'Cart' && cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-purple-600 text-white shadow-lg">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-purple-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </a>
                )}
              </motion.div>
            );

            return content;
          })}

          {/* Let's Talk Button */}
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05, y: -2 }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-sm font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Let's Talk
          </motion.a>
        </div>

        {/* Mobile Burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-white" />
          <motion.span animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-0.5 bg-white" />
          <motion.span animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden bg-[#1a1a1a]/96 backdrop-blur-xl border-t border-purple-500/10"
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive = activePage === item.label.toLowerCase();
            return (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm tracking-wide py-2 border-b border-white/5 transition-colors ${
                  isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </a>
            );
          })}
          <a href="/contact" className="mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-sm font-medium w-full text-center"
            style={{ fontFamily: "'Inter', sans-serif" }}>
              Let's Talk
            </a>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
