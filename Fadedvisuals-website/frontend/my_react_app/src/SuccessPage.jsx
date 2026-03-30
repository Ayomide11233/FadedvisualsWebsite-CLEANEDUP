import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart on successful purchase
    localStorage.removeItem('faded_visuals_cart');
    window.dispatchEvent(new Event('cartUpdated'));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <Navbar />

      <main className="relative pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Title */}
            <h1
              className="text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Payment Successful!
              </span>
            </h1>

            <p className="text-gray-400 text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>

            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/shop')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-2xl font-medium"
                style={{
                  background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Continue Shopping
              </motion.button>

              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-2xl font-medium"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  color: '#c084fc',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessPage;