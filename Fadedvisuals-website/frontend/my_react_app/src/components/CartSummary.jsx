import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/pricing';
import { getShippingCost } from '../data/cart';
import CountrySelector from '../components/CountrySelector';

const CartSummary = ({ 
  subtotal, 
  itemCount, 
  onCheckout, 
  checkoutLoading,
  selectedCountry,
  onCountryChange 
}) => {
 const [displaySubtotal, setDisplaySubtotal] = useState(subtotal);

  // Animate subtotal counting
  useEffect(() => {
    const increment = (subtotal - displaySubtotal) / 10;
    let current = displaySubtotal;
    const interval = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= subtotal) ||
        (increment < 0 && current <= subtotal)
      ) {
        setDisplaySubtotal(subtotal);
        clearInterval(interval);
      } else {
        setDisplaySubtotal(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [subtotal]);

  const shipping = getShippingCost(selectedCountry);
  const total = subtotal + shipping;
  console.log('Selected country:', selectedCountry); // DEBUG
  console.log('Shipping cost:', shipping); // DEBUG

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-24 rounded-2xl p-6"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(168,85,247,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <h2
        className="text-lg font-bold mb-6 tracking-tight"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        Order Summary
      </h2>

      {/* Country Selector */}
      <CountrySelector 
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
      />

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="text-sm font-medium text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          {formatPrice(displaySubtotal)}
        </span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between items-center mb-5">
        <span className="text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          Shipping
        </span>
        <span className="text-sm font-medium text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
          {formatPrice(shipping)}
        </span>
      </div>

      {/* Divider */}
      <div
        className="h-px mb-5"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)' }}
      />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span
          className="text-base font-semibold text-white"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          Total
        </span>
        <motion.span
          key={total}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            background: 'linear-gradient(135deg, #c084fc, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {formatPrice(total)}
        </motion.span>
      </div>

      {/* Checkout button */}
      <motion.button
        onClick={onCheckout}
        disabled={checkoutLoading}
        whileHover={{
          y: -2,
          boxShadow: '0 12px 32px rgba(168,85,247,0.45)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="w-full py-4 rounded-2xl font-semibold text-sm tracking-wide relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          fontFamily: "'Inter', sans-serif",
          background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
          boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
        }}
      >
        <span className="relative z-10">
          {checkoutLoading ? 'REDIRECTING TO CHECKOUT...' : 'PROCEED TO CHECKOUT'}
        </span>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}
        />
      </motion.button>

      {/* Security note */}
      <p
        className="text-xs text-gray-600 text-center mt-4 leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Secure checkout powered by Stripe
      </p>
    </motion.div>
  );
};

export default CartSummary;