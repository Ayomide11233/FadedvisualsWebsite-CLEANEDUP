import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ServiceTierCard = ({ tier, index, isPopular, onClick, serviceName }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{
        scale: 1.03,
        y: -6,
        transition: { duration: 0.25, ease: 'easeInOut' },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(tier, serviceName)}
      className="relative rounded-2xl cursor-pointer flex flex-col overflow-hidden"
      style={{
        background: isPopular
          ? 'linear-gradient(145deg, rgba(88,28,135,0.4) 0%, rgba(55,9,100,0.28) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)',
        border: isPopular
          ? '1px solid rgba(168,85,247,0.5)'
          : '1px solid rgba(255,255,255,0.07)',
        backdropFilter:       'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isPopular
          ? '0 8px 40px rgba(147,51,234,0.22), inset 0 1px 0 rgba(255,255,255,0.07)'
          : '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
        willChange: 'transform',
      }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background: isPopular
            ? 'linear-gradient(90deg, transparent, #a855f7 40%, #c084fc 60%, transparent)'
            : 'linear-gradient(90deg, transparent, rgba(168,85,247,0.35), transparent)',
        }}
      />

      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <span
            className="inline-block text-[9px] tracking-[0.2em] uppercase font-semibold px-4 py-1 rounded-b-lg"
            style={{
              background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
              color: '#f3e8ff',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 4px 12px rgba(147,51,234,0.4)',
            }}
          >
            Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col flex-1">
        {/* Tier label */}
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-medium mb-2"
          style={{
            color: isPopular ? '#c084fc' : '#6b7280',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {tier.label}
        </span>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span
            className="text-3xl font-bold"
            style={{
              fontFamily: "'Unbounded', sans-serif",
              background: isPopular
                ? 'linear-gradient(135deg, #e9d5ff, #a855f7)'
                : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {tier.price}
          </span>
        </div>

        <p
          className="text-gray-500 text-xs mb-5 leading-snug"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {tier.tagline}
        </p>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{
            background: isPopular
              ? 'linear-gradient(90deg, transparent, rgba(168,85,247,0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          }}
        />

        {/* Preview features */}
        <ul className="flex flex-col gap-2 flex-1 mb-5">
          {tier.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <span
                className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)' }}
              >
                <svg className="w-2.5 h-2.5 text-purple-400" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5l2.5 2.5 4.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-gray-400 text-xs leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
                {f}
              </span>
            </li>
          ))}
          {tier.features.length > 3 && (
            <li className="text-purple-500/60 text-xs pl-6.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              +{tier.features.length - 3} more…
            </li>
          )}
        </ul>

        {/* Bottom row */}
        <div
          className="flex items-center justify-between pt-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <span className="text-gray-600 text-[11px]" style={{ fontFamily: "'Inter', sans-serif" }}>
            View details
          </span>
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-purple-400 text-sm"
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceTierCard;
