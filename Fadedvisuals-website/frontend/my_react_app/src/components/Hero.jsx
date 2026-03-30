import React from 'react';
import { motion } from 'framer-motion';
import heroVideo from '../../statics/0216.mp4';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-[#1a1a1a] to-[#1a1a1a]" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          {/* FADED - Left aligned */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-9xl font-bold tracking-tight self-center"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            <span className="block bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
              FADED
            </span>
          </motion.h1>

          {/* Video card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-fit my-8"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-2xl" />
              
              {/* Video container */}
              <div className="relative w-[400px] h-[300px] rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-900/50 p-[3px]">
                <video 
                  src = {heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-[3px] bg-gradient-to-t from-purple-900/40 to-transparent rounded-xl" />
              </div>
            </motion.div>
          </motion.div>

          {/* VISUALS - Right aligned, under video */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight self-center"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              VISUALS
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Elevating brands through distinctive visual storytelling. 
          Where creativity meets precision in every pixel.
        </motion.p>

        <motion.button
          onClick={() => (window.location.href = '/about')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full font-medium tracking-wide overflow-hidden mx-auto block"
        >
          <span className="relative z-10 flex items-center gap-2">
            Learn More
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
    </section>
  );
};

export default Hero;
