import React from 'react';
import { motion } from 'framer-motion';

const QuantitySelector = ({ quantity, onQuantityChange, size = 'default' }) => {
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center ${isSmall ? 'gap-2' : 'gap-3'}`}>
      <motion.button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15 }}
        className={`${isSmall ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-250`}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Decrease quantity"
      >
        <svg className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} fill="none" viewBox="0 0 16 16">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </motion.button>

      <motion.span
        key={quantity}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`${isSmall ? 'w-8 text-sm' : 'w-10 text-base'} text-center text-white font-medium`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {quantity}
      </motion.span>

      <motion.button
        onClick={() => onQuantityChange(quantity + 1)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.15 }}
        className={`${isSmall ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-250`}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Increase quantity"
      >
        <svg className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} fill="none" viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  );
};

export default QuantitySelector;
