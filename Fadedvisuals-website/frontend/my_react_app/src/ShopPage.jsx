import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import AdminProductModal from './components/AdminProductModal';
import { PRODUCTS, CATEGORIES } from './data/products';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

    // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ── 1. FIXED: Improved Admin Check ───────────────────────────────────────
  useEffect(() => {
    console.log("Checking Admin Status..."); // Should see this first
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user') || localStorage.getItem('fv_user');
  
      console.log("Token found:", !!token);
      console.log("User found:", !!storedUser);
  
      if (!token || !storedUser) {
        console.warn("Auth data missing from LocalStorage");
        return;
      }
  
      const user = JSON.parse(storedUser);
      const adminStatus = user.is_admin === true || user.is_admin === 1 || user.is_admin === "1";
      
      setIsAdmin(adminStatus);
      console.log("Final Admin Calculation:", adminStatus);
    } catch (err) {
      console.error("Critical error in Admin check:", err);
    }
  }, []);
  
    // ── Fetch products from API ────────────────────────────────────────────────
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError('');
      try {
        const res = await fetch(`${API_BASE}/products/`);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => { fetchProducts(); }, []);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.category === activeCategory);
  }, [activeCategory, PRODUCTS]);

  // Navigate to product detail
  const handleProductClick = (product) => {
    window.location.href = `/shop/${product.slug || product.id}`;
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleSaved = (savedProduct) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === savedProduct.id);
      if (exists) return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
      return [savedProduct, ...prev];
    });
    setModalOpen(false);
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

      {/* Admin "Add Product" floating button */}
      {isAdmin && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          style={{
            position: 'fixed', top: '88px', right: '24px', zIndex: 60,
            background: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
            border: 'none', borderRadius: '12px',
            padding: '10px 18px', color: '#fff', cursor: 'pointer',
            fontFamily: "'Unbounded', sans-serif", fontSize: '0.6rem',
            letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ADD PRODUCT
        </motion.button>
      )}


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

                        {/* Loading state */}
                        {loading && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem' }}>
                Loading products…
              </div>
            )}

            {/* Fetch error */}
            {fetchError && !loading && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#f87171', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem' }}>
                {fetchError} — <button onClick={fetchProducts} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontFamily: 'inherit' }}>Retry</button>
              </div>
            )}

            {/* Product grid */}
            {!loading && !fetchError && (
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
                      isAdmin={isAdmin}
                      onEdit={handleEdit}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Empty state */}
            {!loading && !fetchError && filteredProducts.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  No products found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />

            {/* Admin modal */}
            <AdminProductModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        product={editingProduct}
        onSaved={handleSaved}
      />
      
    </div>
  );
};

export default ShopPage;
