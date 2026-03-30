import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SchedulerCard = () => {
  useEffect(() => {
    // This script ensures Calendly initializes every time the component mounts
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup the script if the user leaves the page
      document.body.removeChild(script);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ 
        boxShadow: '0 20px 60px rgba(168,85,247,0.15)' 
      }}
      className="w-full rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(168,85,247,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Title */}
      <h2
        className="text-3xl font-bold tracking-tight mb-6"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #c084fc, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Book A Call
        </span>
      </h2>

      {/* Calendly Embed Container */}
      <div className="rounded-xl overflow-hidden bg-transparent">
        <div 
          className="calendly-inline-widget" 
          data-url="https://calendly.com/sayoadeyemiayomide/30min?hide_gdpr_banner=1&background_color=1a1a1a&text_color=ffffff&primary_color=9333ea"
          style={{ 
            minWidth: '320px', 
            height: '630px',
            background: 'transparent' 
          }}
        />
      </div>

      {/* Optional: Simple attribution or footer hint */}
      <p className="mt-4 text-center text-xs text-purple-300/40 uppercase tracking-widest font-medium">
        Secure Scheduling via Calendly
      </p>
    </motion.div>
  );
};

export default SchedulerCard;