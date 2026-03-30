import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import LoopingTicker from './LoopingTicker';

const Services = () => {
  const serviceNames = [
    'Logo Design',
    'Cover Art',
    'Cover Art Animation',
    'Lyric Videos',
    'DJ Visuals',
    'Apparel Mockups',
    'Flyers'
  ];

  const services = [
    {
      title: 'Branding Design',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
      description: 'Distinctive brand identities'
    },
    {
      title: 'Event Designs',
      image: 'https://images.unsplash.com/photo-1653710209991-7b8d6f492e07',
      description: 'High-end event design crafted to elevate atmosphere, emotion, and experience'
    },
    {
      title: 'Music Visuals Suite',
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200',
      description: 'A comprehensive visual ecosystem including custom cover art, motion lyric videos, and immersive stage visuals designed to amplify your sound.'
    },
    {
      title: 'Apparel Mockups',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
      description: 'Merchandise visualization'
    }
  ];

  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  return (
    <section id="services" className="relative py-32 bg-[#1a1a1a]">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <h2 
          className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            SERVICES
          </span>
        </h2>
      </motion.div>

      {/* Looping ticker */}
      <LoopingTicker items={serviceNames} />

      {/* Horizontal scrolling cards */}
      <div ref={containerRef} className="relative">
        <div 
          ref={scrollRef}
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

          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
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
          <span>Scroll horizontally</span>
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

const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleClick = () => {
    if (service.title === 'Branding Design') {
      window.location.href = '/services#branding';
    }
    else if (service.title === 'Music Visuals Suite') {
      window.location.href = '/services#music-visuals-suite';
    }
    else if (service.title === 'Event Designs') {
      window.location.href = '/services#event-design';
    }
    else if (service.title === 'Apparel Mockups') {
      window.location.href = '/services#apparel';
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)'
      }}
      onClick={handleClick}
      className="group relative flex-shrink-0 w-[400px] h-[500px] rounded-2xl overflow-hidden cursor-pointer scroll-snap-align-center"
      style={{ scrollSnapAlign: 'center' }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8">
        <motion.h3 
          className="text-3xl font-bold mb-2 tracking-tight"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          {service.title}
        </motion.h3>
        <p className="text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          {service.description}
        </p>

        {/* Hover glow border */}
        <div className="absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/50 transition-colors duration-300 rounded-2xl" />
      </div>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default Services;
