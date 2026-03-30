import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Stagger container + child variants (reused across sections)
───────────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ─────────────────────────────────────────────────────────────
   AboutHero
───────────────────────────────────────────────────────────── */
const AboutHero = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden"
    >
      {/* ── Background radial glow ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        {/* Primary glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-purple-700/10 blur-[140px]" />
        {/* Left accent */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-purple-900/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Rotated image ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex justify-center lg:justify-start"
          >
            <ImageCard />
          </motion.div>

          {/* ── RIGHT: Text content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            {/* Eyebrow label */}
            <motion.span
              variants={fadeRight}
              className="inline-block text-xs tracking-[0.3em] uppercase text-purple-400 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Our Story
            </motion.span>

            {/* Headline */}
            <motion.h1
              variants={fadeRight}
              className="text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              About{' '}
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Faded Visuals
              </span>
            </motion.h1>

            {/* Paragraphs — each reveals with stagger */}
            {[
              'Faded Visuals is a creative brand built at the intersection of music, art, and visual identity. We exist to give artists and brands the visuals they deserve bold, authentic, and impossible to ignore.',
              'Founded by visual artist Ayomide Sayo-Adeyemi, Faded Visuals specializes in cover art, motion graphics, lyric videos, DJ visuals, logo design, apparel mockups, and digital artwork. Every project is approached with intention, creativity, and a strong focus on visual storytelling.',
              'We don\'t do generic. We do iconic.',
            ].map((text, i) => (
              <HoverParagraph key={i} variants={fadeRight} delay={i * 0.1}>
                {text}
              </HoverParagraph>
            ))}

            {/* CTA row */}
            <motion.div variants={fadeRight} className="flex items-center gap-4 pt-2">
              <motion.a
                href='/contact'
                whileHover={{
                  y: -2,
                  boxShadow: '0 8px 28px rgba(168,85,247,0.45)',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-sm font-medium tracking-wide relative overflow-hidden group"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="relative z-10">Work With Us</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              <motion.a
                href="/services"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                View Services
                <span className="text-purple-500">→</span>
              </motion.a>
            </motion.div>

            {/* Stat row */}
            <motion.div
              variants={fadeRight}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-purple-500/10"
            >
              {[
                { value: '100+', label: 'Projects delivered' },
                { value: '3 yrs', label: 'In the industry' },
                { value: '98%', label: 'Client satisfaction' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span
                    className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {value}
                  </span>
                  <span className="text-xs text-gray-500 leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   ImageCard — rotated, glow, hover interaction
───────────────────────────────────────────────────────────── */
const ImageCard = () => (
  <motion.div
    initial={{ rotate: -6, scale: 0.95, opacity: 0 }}
    animate={{ rotate: -6, scale: 1, opacity: 1 }}
    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{
      rotate: -2,
      scale: 1.03,
      transition: { duration: 0.3, ease: 'easeInOut' },
    }}
    className="relative cursor-pointer select-none"
    style={{
      filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
      willChange: 'transform',
    }}
  >
    {/* Glow layer behind image */}
    <motion.div
      className="absolute inset-0 rounded-2xl bg-purple-600/20 blur-3xl -z-10"
      whileHover={{ opacity: 1.5 }}
      style={{ transform: 'scale(1.15) translateY(10%)' }}
    />

    {/* Main image */}
    <div className="relative w-[340px] sm:w-[400px] lg:w-[460px] rounded-2xl overflow-hidden border border-purple-500/20">
      <img
        src="../../statics/IMG_8007.png"
        alt="Faded Visuals creative studio"
        className="w-full aspect-[4/5] object-cover"
        draggable={false}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#130a24]/70 via-transparent to-transparent" />

      {/* Bottom badge */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <span
          className="text-xs tracking-widest text-purple-300 uppercase font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Since 2019
        </span>
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
      </div>
    </div>

    {/* Floating accent card */}
    <motion.div
      initial={{ opacity: 0, x: 20, y: -10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -top-4 -right-6 bg-[#1e1028]/80 backdrop-blur-md border border-purple-500/25 rounded-xl px-4 py-3 shadow-xl"
    >
      <p className="text-xs text-purple-300 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
        ✦ Creative Studio
      </p>
    </motion.div>

    {/* Second floating accent */}
    <motion.div
      initial={{ opacity: 0, x: -20, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute -bottom-5 -left-5 bg-[#1e1028]/80 backdrop-blur-md border border-purple-500/25 rounded-xl px-4 py-3 shadow-xl"
    >
      <p className="text-xs text-gray-400 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
        🎨 200+ Projects
      </p>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   HoverParagraph
───────────────────────────────────────────────────────────── */
const HoverParagraph = ({ children, variants }) => (
  <motion.p
    variants={variants}
    whileHover={{
      y: -4,
      transition: { duration: 0.25, ease: 'easeInOut' },
    }}
    className="relative text-gray-400 leading-relaxed text-[15px] rounded-xl px-4 py-3 -mx-4 hover:bg-purple-500/5 hover:text-gray-300 transition-colors duration-300 cursor-default"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    {children}
  </motion.p>
);

export default AboutHero;
