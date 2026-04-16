import React, { useState, useEffect, useMemo } from 'react';
import { getProductImage } from './utils/imageUtils'; 
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Accordion from './components/Accordion';
import AdminProductModal from './components/AdminProductModal'; 
import { SizeSelector, QuantitySelector, FrameSelector } from './components/ProductOptions';
import { useParams } from 'react-router-dom';
import { calculatePrice, formatPrice } from './utils/pricing';
import { redirectToCheckout } from './services/stripeService';
import { addToCart } from './utils/cartUtils';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || localStorage.getItem('fv_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAdmin(user.is_admin === true || user.is_admin === 1 || user.is_admin === "1");
    }
  
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const pathParts = window.location.pathname.split('/');
        const productId = pathParts[pathParts.length - 1];
  
        const res = await fetch(`${'http://localhost:8000'}/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        
        const data = await res.json();
  
        const parsedProduct = {
          ...data,
          image: data.image_url || data.image,
          sizes: typeof data.sizes_json === 'string' ? JSON.parse(data.sizes_json) : (data.sizes || []),
          frames: typeof data.frames_json === 'string' ? JSON.parse(data.frames_json) : (data.frames || [])
        };
  
        setProduct(parsedProduct);
        
        if (parsedProduct.sizes?.length > 0) setSelectedSize(parsedProduct.sizes[0]);
        if (parsedProduct.frames?.length > 0) setSelectedFrame(parsedProduct.frames[0].label);
        
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, []);

  const handleProductUpdate = (updatedProduct) => {
    setProduct(updatedProduct);
    setIsModalOpen(false);
  };

  const priceData = useMemo(() => {
    if (!product) return null;
    return calculatePrice(product.price, selectedSize, selectedFrame, quantity);
  }, [product, selectedSize, selectedFrame, quantity]);

  const handleBuyNow = async () => {
    setBuyNowLoading(true);
    try {
      // 1. Get unit price specifically for 1 item, then convert to cents
      const unitPrice = calculatePrice(product.price, selectedSize, selectedFrame, 1);
      
      // 2. Construct the item object matching your FastAPI CheckoutItem model
      const checkoutItem = {
        product_id: String(product.id), // FastAPI expects Optional[str]
        title: product.title,
        quantity: quantity, 
        size: selectedSize || "Standard", 
        frame: selectedFrame || "No Frame",
        unit_amount: Math.round(unitPrice.total * 100), 
        currency: "usd"
      };
      
      // 3. Construct the full payload matching your FastAPI CreateCheckoutSession model
      const payload = {
        items: [checkoutItem], // We put the object inside this array
        currency: "usd",
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.href
      };
  
      console.log("FINAL PAYLOAD TO BACKEND:", payload);

      // 4. Send the FULL payload, not just the items array
      await redirectToCheckout(payload);

    } catch (error) {
      console.error('Buy Now error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setBuyNowLoading(false);
    }
};

  const handleBack = () => {
    window.location.href = '/shop';
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedFrame, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-gray-500">Loading Product...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
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
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.12) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <motion.button
              onClick={handleBack}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 12 12">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Shop
            </motion.button>

            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg text-xs font-bold"
              >
                EDIT PRODUCT DATA
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-2xl opacity-60 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
              />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-purple-500/20">
                <img src={getProductImage(product)} alt={product.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/40 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col"
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {product.title}
              </h1>

              <div className="mb-6">
                <div className="text-3xl font-bold" style={{
                    fontFamily: "'Unbounded', sans-serif",
                    background: 'linear-gradient(135deg, #c084fc, #9333ea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {formatPrice(priceData?.total || product.price)}
                </div>
                
                {priceData && (priceData.breakdown.sizeUpcharge + priceData.breakdown.frameUpcharge > 0) && (
                  <div className="mt-2 text-xs text-gray-500 space-y-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div>Base: {formatPrice(priceData.breakdown.basePrice)}</div>
                    {priceData.breakdown.sizeUpcharge > 0 && <div>Size: +{formatPrice(priceData.breakdown.sizeUpcharge)}</div>}
                    {priceData.breakdown.frameUpcharge > 0 && <div>Frame: +{formatPrice(priceData.breakdown.frameUpcharge)}</div>}
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                {product.description}
              </p>

              <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.2), transparent)' }} />

              <div className="space-y-6 mb-8">
                <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSizeChange={setSelectedSize} />
                <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                {product.frames?.length > 0 && (
                  <FrameSelector frames={product.frames} selectedFrame={selectedFrame} onFrameChange={setSelectedFrame} />
                )}
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(168,85,247,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden group"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: addedToCart ? '#10b981' : 'linear-gradient(135deg, #9333ea, #7c3aed)',
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}
                  </span>
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  disabled={buyNowLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-4 rounded-xl font-medium text-sm tracking-wide border border-purple-500/30 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {buyNowLoading ? 'REDIRECTING...' : 'BUY NOW'}
                </motion.button>
              </div>

              <div className="space-y-1">
                <Accordion title="DETAILS">{product.details}</Accordion>
                <Accordion title="SHIPPING">{product.shipping}</Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
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