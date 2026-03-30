import React from 'react';
import { motion } from 'framer-motion';

const LoopingTicker = ({ items }) => {
  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-8 mb-16">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1a1a1a] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1a1a1a] to-transparent z-10" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1920] // Adjust based on content width
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        whileHover={{
          animationPlayState: "paused"
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="text-5xl font-bold tracking-tight text-transparent bg-gradient-to-r from-purple-500/30 to-purple-700/30 bg-clip-text hover:from-purple-400 hover:to-purple-600 transition-all duration-300"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default LoopingTicker;
