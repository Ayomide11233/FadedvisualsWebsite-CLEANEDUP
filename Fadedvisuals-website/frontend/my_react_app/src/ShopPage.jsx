import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import { PRODUCTS, CATEGORIES } from './data/products';

/* ═══════════════════════════════════════════════════════════
   SHOP HERO
═══════════════════════════════════════════════════════════ */
const ShopHero = () => (
  <section className="relative pt-40 pb-16 px-6 overflow-hidden">
    {/* Background glow */}
    <div
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]"
      style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.15) 0%, transparent 70%)' }}
      aria-hidden
    />

    <div className="relative z-10 max-w-7xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0]"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        <span
          className="block lg:inline"
          style={{
            background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 50%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          YA
        </span>
        <span className="block lg:inline text-gray-600 mx-0 lg:mx-4 text-5xl sm:text-5xl">
          [ STUDIOS ]
        </span>
        <span
          className="block lg:inline"
          style={{
            background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
           ZO
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-500 text-sm mt-6 max-w-md mx-auto"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Limited edition prints, exclusive apparel, and collectible art drops.
      </motion.p>
    </div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
  </section>
);

/* ═══════════════════════════════════════════════════════════
   SHOP PAGE - main component
═══════════════════════════════════════════════════════════ */
const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Navigate to product detail
  const handleProductClick = (product) => {
    window.location.href = `/shop/${product.id}`;
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
      <Navbar activePage="shop" />

      <main>
        <ShopHero />

        {/* Product grid section */}
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
            {/* Category filter */}
            <CategoryFilter
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Product grid with fade transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={handleProductClick}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  No products found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
    </div>
  );
};

export default ShopPage;
