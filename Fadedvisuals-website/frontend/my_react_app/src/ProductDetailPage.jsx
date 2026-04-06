import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Accordion from './components/Accordion';
import AdminProductModal from './components/AdminProductModal'; // 1. 
import { SizeSelector, QuantitySelector, FrameSelector } from './components/ProductOptions';
import { PRODUCTS } from './data/products';
import { calculatePrice, formatPrice } from './utils/pricing';
import { redirectToCheckout } from './services/stripeService';
import { addToCart } from './utils/cartUtils';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
   // --- ADMIN STATE ---
   const [isAdmin, setIsAdmin] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);

  // Get product ID from URL path
  useEffect(() => {
    // Check for admin status on load
    const storedUser = localStorage.getItem('user') || localStorage.getItem('fv_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.is_admin === true || user.is_admin === 1 || user.is_admin === "1");
    }
  
      // Existing product loading logic
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    const foundProduct = PRODUCTS.find((p) => p.id === productId);

    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      if (foundProduct.frames) {
        setSelectedFrame(foundProduct.frames[0].label);
      }
    }
  }, []);

   // --- Handlers ---
   const handleProductUpdate = (updatedProduct) => {
    setProduct(updatedProduct);
    setIsModalOpen(false);
  };

  

  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const handleBuyNow = async () => {
    setBuyNowLoading(true);
    
    try {
      // Calculate UNIT price (quantity = 1)
      const unitPrice = calculatePrice(product.price, selectedSize, selectedFrame, 1);
      
      const stripeItems = [{
        product_id: product.id,
        title: product.title,
        price: unitPrice.total, // ← Unit price
        quantity: quantity, // ← Stripe multiplies this
        size: selectedSize || 'M',
        frame: selectedFrame || 'No Frame'
      }];
      
      await redirectToCheckout(stripeItems);
    } catch (error) {
      console.error('Buy Now error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setBuyNowLoading(false);
    }
  };
  // Calculate total price with upcharges
  const priceData = useMemo(() => {
    if (!product) return null;
    return calculatePrice(product.price, selectedSize, selectedFrame, quantity);
  }, [product, selectedSize, selectedFrame, quantity]);

  // Handle back navigation
  const handleBack = () => {
    window.location.href = '/shop';
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedFrame, quantity);
    setAddedToCart(true);
    
    // Reset feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

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

      <main className="relative pt-32 pb-24 px-6">
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.12) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back button */}
          <motion.button
            onClick={handleBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors mb-8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 12 12">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Shop
          </motion.button>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* LEFT: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Glow behind image */}
              <div
                className="absolute -inset-6 rounded-2xl opacity-60 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Image container */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-purple-500/20">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
              </div>
            </motion.div>

            {/* RIGHT: Product info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                {product.title}
              </motion.h1>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
              >
                <div
                  className="text-3xl font-bold"
                  style={{
                    fontFamily: "'Unbounded', sans-serif",
                    background: 'linear-gradient(135deg, #c084fc, #9333ea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {formatPrice(priceData?.total || product.price)}
                </div>
                
                {/* Price breakdown */}
                {priceData && priceData.breakdown.sizeUpcharge + priceData.breakdown.frameUpcharge > 0 && (
                  <div className="mt-2 text-xs text-gray-500 space-y-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div>Base: {formatPrice(priceData.breakdown.basePrice)}</div>
                    {priceData.breakdown.sizeUpcharge > 0 && (
                      <div>Size upcharge ({selectedSize}): +{formatPrice(priceData.breakdown.sizeUpcharge)}</div>
                    )}
                    {priceData.breakdown.frameUpcharge > 0 && (
                      <div>Frame: +{formatPrice(priceData.breakdown.frameUpcharge)}</div>
                    )}
                    {quantity > 1 && (
                      <div className="pt-1 border-t border-purple-500/10">
                        Subtotal × {quantity} = {formatPrice(priceData.total)}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-gray-400 text-sm leading-relaxed mb-8"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {product.description}
              </motion.p>

              {/* Divider */}
              <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.2), transparent)' }} />

              {/* Options */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SizeSelector
                  sizes={product.sizes}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                />

                <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

                {product.frames && (
                  <FrameSelector
                    frames={product.frames}
                    selectedFrame={selectedFrame}
                    onFrameChange={setSelectedFrame}
                  />
                )}
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col gap-3 mb-8"
              >
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(168,85,247,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden group"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: addedToCart 
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : 'linear-gradient(135deg, #9333ea, #7c3aed)',
                    boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {addedToCart ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        ADDED TO CART
                      </>
                    ) : (
                      'ADD TO CART'
                    )}
                  </span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: addedToCart 
                        ? 'linear-gradient(135deg, #059669, #047857)' 
                        : 'linear-gradient(135deg, #a855f7, #9333ea)' 
                    }}
                  />
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading}
                  whileHover={{ scale: 1.01, boxShadow: '0 0 24px rgba(168,85,247,0.2)' }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'rgba(168,85,247,0.1)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    color: '#c084fc',
                  }}
                >
                  {buyNowLoading ? 'REDIRECTING...' : 'BUY NOW'}
                </motion.button>
              </motion.div>

              {/* Accordions */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <Accordion title="DETAILS">{product.details}</Accordion>
                <Accordion title="SHIPPING">{product.shipping}</Accordion>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
       {/* --- MODAL RENDER --- */}
       {isAdmin && (
        <AdminProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          onSaved={handleProductUpdate}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
