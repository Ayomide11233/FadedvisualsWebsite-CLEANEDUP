import React from 'react';
import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <nav className="flex items-center justify-center gap-8 mb-16">
      {categories.map((cat, index) => {
        const isActive = activeCategory === cat.id;
        return (
          <motion.button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative text-sm tracking-[0.15em] font-medium transition-all duration-300 pb-1 ${
              isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {cat.label}

            {/* Animated underline */}
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, #9333ea, #a855f7)',
                boxShadow: isActive ? '0 0 8px rgba(168,85,247,0.6)' : 'none',
              }}
              initial={false}
              animate={{
                width: isActive ? '100%' : '0%',
                opacity: isActive ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />

            {/* Hover glow */}
            {!isActive && (
              <span
                className="absolute inset-0 rounded opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: '0 0 16px rgba(168,85,247,0.2)' }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};

export default CategoryFilter;
