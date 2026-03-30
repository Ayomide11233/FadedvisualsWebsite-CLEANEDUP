import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ProductCard = ({ product, index, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

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
      onClick={() => onClick(product)}
      className="group relative cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        {/* Glow layer behind image */}
        <motion.div
          className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Image */}
        <div className="relative w-full h-full overflow-hidden rounded-2xl border border-purple-500/10 group-hover:border-purple-500/30 transition-colors duration-300">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.95)' }}
            whileHover={{ filter: 'brightness(1.05)' }}
            transition={{ duration: 0.3 }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />

          {/* Title overlay */}
          <div className="absolute top-4 left-4">
            <h3
              className="text-white text-sm font-medium tracking-wide drop-shadow-lg"
              style={{ fontFamily: "'Inter', sans-serif", textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
            >
              {product.title}
            </h3>
          </div>

          {/* Price - fades in on hover */}
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
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              $ {product.price}
            </span>
          </motion.div>
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
