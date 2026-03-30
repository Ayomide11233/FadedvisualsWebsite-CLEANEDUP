import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
import { calculatePrice } from './utils/pricing';
import { getCartItems, updateCartItemQuantity, removeFromCart } from './utils/cartUtils';
import { redirectToCheckout, getCurrencyContext } from './services/stripeService';
import { getShippingCost } from './data/cart';


/* ═══════════════════════════════════════════════════════════
   CART HERO
═══════════════════════════════════════════════════════════ */
const CartHero = ({ itemCount }) => (
  <section className="relative pt-40 pb-16 px-6 overflow-hidden">
    {/* Background glow */}
    <div
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
      style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.12) 0%, transparent 70%)' }}
      aria-hidden
    />

    <div className="relative z-10 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Cart
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-gray-500 text-sm"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {itemCount === 0 ? 'Your cart is empty' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
      </motion.p>
    </div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
  </section>
);

/* ═══════════════════════════════════════════════════════════
   EMPTY CART STATE
═══════════════════════════════════════════════════════════ */
const EmptyCart = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center py-20"
  >
    <div className="inline-block p-6 rounded-2xl mb-6" style={{ background: 'rgba(168,85,247,0.05)' }}>
      <svg className="w-16 h-16 text-purple-500/50 mx-auto" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.35 5.39A1 1 0 006.6 20h11.8a1 1 0 00.95-1.39L17 13M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3
      className="text-xl font-semibold text-white mb-2"
      style={{ fontFamily: "'Unbounded', sans-serif" }}
    >
      Your cart is empty
    </h3>
    <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      Add some artwork to get started
    </p>
    <motion.a
      href="/shop"
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(168,85,247,0.35)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="inline-block px-8 py-3 rounded-2xl font-medium text-sm tracking-wide"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
        boxShadow: '0 4px 16px rgba(147,51,234,0.25)',
      }}
    >
      Browse Shop
    </motion.a>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   CART PAGE - main component
═══════════════════════════════════════════════════════════ */
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('CA-pk');

  // ─── NEW CURRENCY STATES ──────────────────────────────────────────
  const [currencyData, setCurrencyData] = useState({ localCurrency: 'USD', rate: 1 });
  const [isLocalMode, setIsLocalMode] = useState(true); // Toggle state

  // Load cart from localStorage on mount
  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate totals
  const { subtotal, itemCount } = useMemo(() => {
    const total = cartItems.reduce((sum, item) => {
      const priceData = calculatePrice(item.price, item.size, item.frame, item.quantity);
      return sum + priceData.total;
    }, 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: total, itemCount: count };
  }, [cartItems]);

  // Handle checkout
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    
    try {
      const shipping = getShippingCost(selectedCountry);
      const selectedCurrency = isLocalMode ? currencyData.localCurrency : 'USD';
      console.log('🛒 Checkout Debug:');
      console.log('  Selected Country:', selectedCountry);
      console.log('  Shipping Cost:', shipping);
      console.log('  Subtotal:', subtotal);
      console.log('  Total:', subtotal + shipping);
      
      // Format cart items for Stripe
      const stripeItems = cartItems.map(item => {
        const itemPrice = calculatePrice(item.price, item.size, item.frame, 1);
        
        return {
          product_id: item.id || item.productId,
          title: item.title,
          price: itemPrice.total,
          quantity: item.quantity,
          size: item.size || 'M',
          frame: item.frame || 'No Frame'
        };
      });
      
      // Add shipping as a line item
      stripeItems.push({
        product_id: 'shipping',
        title: `Shipping to ${selectedCountry}`,
        price: shipping,
        quantity: 1,
        size: null,
        frame: null
      });

      // Redirect to Stripe Checkout
      await redirectToCheckout(stripeItems);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Update quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = updateCartItemQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
  };

  // Remove item
  const handleRemove = (itemId) => {
    const updatedCart = removeFromCart(itemId);
    setCartItems(updatedCart);
  };

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
        aria-hidden
      />

      <ScrollProgress />
      <Navbar activePage="cart" />

      <main>
        <CartHero itemCount={itemCount} />

        {/* Main content */}
        <section className="relative px-6 pb-32 overflow-hidden">
          {/* Ambient glows */}
          <div
            className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px]"
            style={{ background: 'radial-gradient(circle, rgba(88,28,135,0.06) 0%, transparent 70%)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-1/3 left-0 w-[400px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(88,28,135,0.05) 0%, transparent 70%)' }}
            aria-hidden
          />

          <div className="relative z-10 max-w-7xl mx-auto">
            {cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Cart items */}
                <div className="lg:col-span-8">
                  {/* Table header (desktop only) */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 mb-4">
                    <div className="col-span-5">
                      <span className="text-xs tracking-[0.15em] uppercase text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Product
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-xs tracking-[0.15em] uppercase text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Price
                      </span>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className="text-xs tracking-[0.15em] uppercase text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Quantity
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-xs tracking-[0.15em] uppercase text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Subtotal
                      </span>
                    </div>
                  </div>

                  {/* Cart items */}
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        index={index}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Right: Order summary */}
                <div className="lg:col-span-4">
                  <CartSummary 
                    subtotal={subtotal} 
                    itemCount={itemCount}
                    onCheckout={handleCheckout}
                    checkoutLoading={checkoutLoading}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;