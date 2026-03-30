import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  multiline = false,
  rows = 4
}) => {
  const baseClasses = `
    w-full px-4 py-3 rounded-xl 
    bg-white/5 
    border border-purple-500/20 
    text-white placeholder-gray-500 
    focus:outline-none focus:border-purple-500/50 
    transition-all duration-300
  `;

  const focusGlow = `
    focus:shadow-[0_0_20px_rgba(168,85,247,0.3)]
  `;

  return (
    <div className="mb-4">
      {label && (
        <label 
          className="block text-sm font-medium text-gray-400 mb-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
      )}
      
      {multiline ? (
        <motion.textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseClasses} ${focusGlow} resize-y min-h-[120px]`}
          style={{ fontFamily: "'Inter', sans-serif" }}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} ${focusGlow}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
};

export default InputField;