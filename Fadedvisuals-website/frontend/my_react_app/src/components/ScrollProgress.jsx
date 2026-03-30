import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 origin-left z-[100]"
      style={{ 
        scaleX: scrollYProgress,
        boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
      }}
    />
  );
};

export default ScrollProgress;
