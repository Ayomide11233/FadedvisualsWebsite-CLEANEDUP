import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/imageUtils';
import CartQuantitySelector from './CartQuantitySelector';
import { calculatePrice, formatPrice } from '../utils/pricing';

const CartItem = ({ item, onQuantityChange, onRemove, index }) => {
  // Calculate item subtotal with upcharges
  const priceData = calculatePrice(item.price, item.size, item.frame, item.quantity);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group relative rounded-2xl p-4 transition-all duration-300 mb-4"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
        whileHover={{
          background: 'rgba(255,255,255,0.04)',
          borderColor: 'rgba(168,85,247,0.15)',
        }}
      >
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Product info - Image + Name */}
          <div className="md:col-span-5 flex items-center gap-4">
            {/* Image */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-purple-500/10">
              <img
                src={getProductImage(item)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-white font-medium text-sm mb-1 truncate"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                {item.title}
              </h3>
              <div className="text-xs text-gray-500 space-y-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div>Size: {item.size}</div>
                <div>Frame: {item.frame}</div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="md:col-span-2 flex md:justify-center">
            <div>
              <div
                className="text-sm font-medium text-gray-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formatPrice(priceData.breakdown.subtotal)}
              </div>
              {(priceData.breakdown.sizeUpcharge > 0 || priceData.breakdown.frameUpcharge > 0) && (
                <div className="text-xs text-gray-600 mt-0.5">
                  Base: {formatPrice(priceData.breakdown.basePrice)}
                </div>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="md:col-span-3 flex md:justify-center">
            <CartQuantitySelector
              quantity={item.quantity}
              onQuantityChange={(newQty) => onQuantityChange(item.id, newQty)}
              size="small"
            />
          </div>

          {/* Subtotal */}
          <div className="md:col-span-2 flex md:justify-end items-center gap-4">
            <motion.div
              key={priceData.total}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-base font-bold"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                background: 'linear-gradient(135deg, #c084fc, #9333ea)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatPrice(priceData.total)}
            </motion.div>

            {/* Remove button */}
            <motion.button
              onClick={() => onRemove(item.id)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-250"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
              aria-label="Remove item"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 12 12">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartItem;
