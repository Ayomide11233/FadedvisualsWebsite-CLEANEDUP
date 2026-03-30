import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import LoopingTicker from './LoopingTicker';

const Collectables = () => {
  const collectableNames = [
    'Poster Drops',
    'Limited Prints',
    'Limited Apparel',
    'Exclusive Drops',
    'Art Editions',
  ];

  const collectables = [
    {
      title: 'Golden age',
      image: '../../statics/Ant-season.png',
      edition: 'Limited Edition 1/50'
    },
    {
      title: 'Flower Culture',
      image: '../../statics/Tobesta.png',
      edition: '2k26 BHM collection'
    },
    {
      title: 'Play Boy',
      image: '../../statics/PLAY-BOY-REMY.png',
      edition: 'Collector Series'
    },
    {
      title: 'Focus',
      image: '../../statics/Ape-bape.png',
      edition: '2k25 BHM collection'
    },
    {
      title: 'Brighter Future',
      image: '../../statics/Pattern.png',
      edition: 'Collector Series'
    }
  ];


  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section 
      id="collectables" 
      ref={containerRef}
      className="relative py-32 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-900/5 rounded-full blur-[150px]" />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4 relative z-10"
      >
        <h2 
          className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            SHOP
          </span>
        </h2>
      </motion.div>

      {/* Looping ticker */}
      <LoopingTicker items={collectableNames} />

      {/* Horizontal scrolling cards */}
      <div className="relative">
        <div 
          className="flex gap-8 px-6 overflow-x-auto scrollbar-hide pb-8"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Spacer */}
          <div className="flex-shrink-0 w-32" />

          {collectables.map((item, index) => (
            <CollectableCard 
              key={item.title} 
              item={item} 
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Spacer */}
          <div className="flex-shrink-0 w-32" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm text-gray-500 flex items-center gap-2"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

const CollectableCard = ({ item, index, scrollYProgress }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -50 * (index % 2 === 0 ? 1 : -1)]
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -10 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateY: 0 
      } : { 
        opacity: 0, 
        y: 50, 
        rotateY: -10 
      }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        boxShadow: '0 0 50px rgba(168, 85, 247, 0.4)'
      }}
      className="group relative flex-shrink-0 w-[350px] h-[450px] rounded-2xl overflow-hidden cursor-pointer perspective-1000"
      style={{ 
        scrollSnapAlign: 'center',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div 
        className="absolute inset-0"
        style={{ y }}
      >
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
      </motion.div>

      <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/60 transition-all duration-500 rounded-2xl" />

      <div className="relative h-full flex flex-col justify-end p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <span className="inline-block px-4 py-1 mb-4 text-xs font-medium tracking-wider bg-purple-600/30 backdrop-blur-sm rounded-full border border-purple-500/30">
            {item.edition}
          </span>
          <h3 
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            {item.title}
          </h3>
          
          <motion.a
            href='/shop'
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-purple-400 text-sm font-medium mt-4 group-hover:text-purple-300 transition-colors"
          >
            View Details
            <span>→</span>
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default Collectables;