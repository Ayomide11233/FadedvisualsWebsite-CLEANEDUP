import React from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   SIZE SELECTOR
═══════════════════════════════════════════════════════════ */
export const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => (
  <div className="mb-6">
    <label
      className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-3"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Size
    </label>
    <div className="flex gap-3">
      {sizes.map((size) => {
        const isActive = selectedSize === size;
        return (
          <motion.button
            key={size}
            onClick={() => onSizeChange(size)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`px-6 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/8 hover:text-gray-300'
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              border: isActive ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.05)',
              boxShadow: isActive ? '0 0 16px rgba(168,85,247,0.3)' : 'none',
            }}
          >
            {size}
          </motion.button>
        );
      })}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   QUANTITY SELECTOR
═══════════════════════════════════════════════════════════ */
export const QuantitySelector = ({ quantity, onQuantityChange }) => (
  <div className="mb-6">
    <label
      className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-3"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      Quantity
    </label>
    <div className="flex items-center gap-4">
      <motion.button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-250"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </motion.button>

      <span
        className="w-12 text-center text-white text-lg font-medium"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        {quantity}
      </span>

      <motion.button
        onClick={() => onQuantityChange(quantity + 1)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-250"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </motion.button>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   FRAME COLOR SELECTOR
═══════════════════════════════════════════════════════════ */
export const FrameSelector = ({ frames, selectedFrame, onFrameChange }) => {
  if (!frames) return null;

  return (
    <div className="mb-6">
      <label
        className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-3"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Add Frame
      </label>
      <div className="flex gap-3">
        {frames.map((frame) => {
          const isActive = selectedFrame === frame.label;
          return (
            <motion.button
              key={frame.label}
              onClick={() => onFrameChange(frame.label)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: frame.color,
                border: isActive
                  ? '3px solid rgba(168,85,247,0.8)'
                  : '2px solid rgba(255,255,255,0.15)',
                boxShadow: isActive
                  ? '0 0 16px rgba(168,85,247,0.5), inset 0 1px 2px rgba(0,0,0,0.2)'
                  : 'inset 0 1px 2px rgba(0,0,0,0.2)',
              }}
              aria-label={`${frame.label} frame`}
              title={frame.label}
            >
              {/* Inner ring for lighter colors */}
              {frame.color === '#ffffff' && (
                <div
                  className="absolute inset-1 rounded-full"
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                />
              )}

              {/* Active checkmark */}
              {isActive && (
                <motion.svg
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 12 12"
                  style={{
                    filter: frame.color === '#ffffff' || frame.color === '#d4af37' ? 'none' : 'invert(1)',
                  }}
                >
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
