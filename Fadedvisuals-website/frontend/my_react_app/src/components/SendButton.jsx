import React from 'react';
import { motion } from 'framer-motion';

const SendButton = ({ children, onClick, disabled = false, loading = false }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 0 30px rgba(168,85,247,0.5)' 
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="w-full py-4 rounded-full font-semibold text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: 'transparent',
        border: '2px solid rgba(168,85,247,0.5)',
        color: '#c084fc',
        boxShadow: '0 0 20px rgba(168,85,247,0.2)',
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>SENDING...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default SendButton;