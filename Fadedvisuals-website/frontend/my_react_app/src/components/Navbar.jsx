import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCartItemCount } from '../utils/cartUtils';

const Navbar = ({ activePage = 'home' }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count on mount and when storage changes
  useEffect(() => {
    const updateCount = () => setCartCount(getCartItemCount());
    updateCount();
    
    // Listen for storage changes (when cart is updated from other tabs/windows)
    window.addEventListener('storage', updateCount);
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', updateCount);
    
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services'},
    { label: 'Shop', href: '/shop' },
    { label: 'Cart', href: '/cart' },
  ];

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
          {navItems.map((item, index) => {
            const isActive = activePage === item.label.toLowerCase();
            return (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`relative text-sm tracking-wide transition-colors duration-300 group pb-1 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
                
                {/* Cart badge */}
                {item.label === 'Cart' && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                      boxShadow: '0 2px 8px rgba(147,51,234,0.4)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
                
                {/* Animated underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-300 rounded-full ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
                {/* Active glow dot */}
                {isActive && (
                  <motion.span
                    layoutId="navDot"
                    className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-purple-500"
                    style={{ boxShadow: '0 0 8px 3px rgba(168,85,247,0.6)' }}
                  />
                )}
              </motion.a>
            );
          })}

          <motion.a
            href="/contact"
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: '0 8px 24px rgba(168, 85, 247, 0.45)',
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-sm font-medium tracking-wide relative overflow-hidden group"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="relative z-10">Let's Talk</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
