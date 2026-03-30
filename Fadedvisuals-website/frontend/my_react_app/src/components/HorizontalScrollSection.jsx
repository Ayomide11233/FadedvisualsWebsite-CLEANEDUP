import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HorizontalScrollSection = ({ children, title }) => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    if (!container || !scrollContainer) return;

    const handleScroll = (e) => {
      const rect = container.getBoundingClientRect();
      const isInView = rect.top <= 0 && rect.bottom > window.innerHeight;
      
      if (isInView) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScrollLeft = scrollContainer.scrollLeft;
        
        // If we haven't reached the end of horizontal scroll
        if (currentScrollLeft < maxScrollLeft - 10) {
          e.preventDefault();
          setIsHorizontalScroll(true);
          
          // Scroll horizontally
          const delta = e.deltaY || e.detail || e.wheelDelta;
          scrollContainer.scrollLeft += delta;
        } else {
          // Allow normal vertical scroll to continue
          setIsHorizontalScroll(false);
        }
      }
    };

    // Add wheel event listener
    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen py-20">
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 px-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
