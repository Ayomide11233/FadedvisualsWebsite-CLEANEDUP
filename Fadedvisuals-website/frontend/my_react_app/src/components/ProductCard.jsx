import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// --- Helper to determine if product is actually in stock ---
const isProductAvailable = (product) => {
  // Check for various ways 'in_stock' might be represented
  if (product.in_stock === false || product.in_stock === 0) return false;
  if (product.in_stock === true || product.in_stock === 1) return true;
  return true; // Default to true if the field is missing to avoid fake sold-out states
};

const ProductCard = ({ product, index, onClick, isAdmin, onEdit }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const available = isProductAvailable(product);

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevents navigating to product detail when clicking edit
    onEdit(product);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3, ease: 'easeInOut' },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(product)} // This passes the whole 'product' object to ShopPage
      className="group relative cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        {/* Glow layer behind image */}
        <div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Image Wrapper */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl border border-purple-500/10 group-hover:border-purple-500/30 transition-colors duration-300">
          <motion.img
            src={product.image_url || product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ filter: available ? 'brightness(0.95)' : 'brightness(0.5) grayscale(0.5)' }}
            whileHover={{ filter: available ? 'brightness(1.05)' : 'brightness(0.6) grayscale(0.5)' }}
            transition={{ duration: 0.3 }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />

          {/* FIXED: Sold Out badge logic */}
          {!available && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(220, 38, 38, 0.9)', // Solid red for clarity
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px', padding: '4px 10px',
              color: 'white', fontSize: '0.6rem', fontWeight: 'bold',
              fontFamily: "'Unbounded', sans-serif", letterSpacing: '0.1em',
              zIndex: 10,
            }}>
              SOLD OUT
            </div>
          )}

          {/* Title overlay */}
          <div className="absolute top-4 left-4">
            <h3
              className="text-white text-sm font-medium tracking-wide drop-shadow-lg"
              style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              {product.title}
            </h3>
          </div>

          {/* Price - appears on hover */}
          <motion.div
            className="absolute bottom-4 left-4"
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-white text-lg font-bold tracking-wide"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              ${product.price}
            </span>
          </motion.div>

          {/* Admin edit button - Made more visible for the Admin */}
          {isAdmin && (
            <button
              onClick={handleEdit}
              className="absolute bottom-4 right-4 z-20"
              style={{
                background: '#c084fc', 
                border: 'none',
                borderRadius: '8px', padding: '8px 12px',
                color: '#000', cursor: 'pointer',
                fontFamily: "'Unbounded', sans-serif", fontSize: '0.55rem',
                fontWeight: 'bold',
                letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '5px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              EDIT
            </button>
          )}
        </div>

        {/* Top shine accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(90deg, transparent, #a855f7 50%, transparent)' }}
        />
      </div>
    </motion.div>
  );
};

export default ProductCard;