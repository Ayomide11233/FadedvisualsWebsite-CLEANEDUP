import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.2,  ease: 'easeIn'  } },
};

const modalVariants = {
  hidden:  { opacity: 0, scale: 0.88, y: 40 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: 'spring', damping: 26, stiffness: 300, mass: 0.8 } },
  exit:    { opacity: 0, scale: 0.92, y: 24, transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] } },
};

const featureContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
};

const featureItemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

const PricingModal = ({ tier, serviceName, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!tier) return null;

  return (
    <motion.div
      key="overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{ background: 'rgba(8, 3, 18, 0.82)' }}
      onClick={onClose}
    >
      {/* Radial glow behind modal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)' }}
      />

      <motion.div
        key="modal"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(168,85,247,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }} />

        {/* Inner radial glow */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: 'radial-gradient(ellipse 300px 180px at 50% -10%, rgba(139,92,246,0.13) 0%, transparent 70%)' }} />

        <div className="relative z-10 p-8">
          {/* Header row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-purple-500 font-medium block mb-1"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {serviceName}
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}>
                {tier.label} Tier
              </h2>
              <p className="text-gray-400 text-sm mt-1.5 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {tier.description}
              </p>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </motion.button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-5">
            <span className="text-4xl font-bold"
              style={{
                fontFamily: "'Unbounded', sans-serif",
                background: 'linear-gradient(135deg, #c084fc, #9333ea)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {tier.price}
            </span>
            <span className="text-gray-500 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              / project
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px mb-5"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)' }} />

          {/* Features */}
          <motion.ul
            variants={featureContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 mb-7"
          >
            {tier.features.map((feature) => (
              <motion.li key={feature} variants={featureItemVariants} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.4)' }}>
                  <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {feature}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.a
            href='/contact'
            whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(168,85,247,0.45)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            // Added 'flex', 'items-center', and 'justify-center'
            className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden group flex items-center justify-center text-white no-underline"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
              boxShadow: '0 4px 20px rgba(147,51,234,0.3)',
              display: 'flex', // Double-check it has flex display
            }}
          >
            <span className="relative z-10">Get Started</span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }} 
            />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PricingModal;
