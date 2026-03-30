import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Reusable scroll-reveal block
───────────────────────────────────────────────────────────── */
const RevealBlock = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Value Pill
───────────────────────────────────────────────────────────── */
const ValuePill = ({ icon, title, desc, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        transition: { duration: 0.25, ease: 'easeInOut' },
      }}
      className="group relative bg-[#1e1028]/50 border border-purple-500/10 hover:border-purple-500/30 rounded-2xl p-6 transition-colors duration-300"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
           style={{ boxShadow: 'inset 0 0 40px rgba(168,85,247,0.05)' }} />

      <span className="text-3xl mb-4 block">{icon}</span>
      <h3
        className="text-white font-semibold text-base mb-2 tracking-tight"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="text-gray-500 text-sm leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {desc}
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Timeline item
───────────────────────────────────────────────────────────── */
const TimelineItem = ({ year, title, body, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-8 border-l border-purple-500/20"
    >
      {/* Dot */}
      <div className="absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-purple-600"
           style={{ boxShadow: '0 0 10px 3px rgba(168,85,247,0.4)' }} />

      <span
        className="text-purple-500 text-xs tracking-widest uppercase font-medium block mb-1"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {year}
      </span>
      <h4
        className="text-white font-semibold text-base mb-2"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        {title}
      </h4>
      <p
        className="text-gray-500 text-sm leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {body}
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   AboutContent — main export
───────────────────────────────────────────────────────────── */
const AboutContent = () => {
  const values = [
    {
      icon: '⚡',
      title: 'Bold by Default',
      desc: 'We refuse mediocrity. Every pixel is intentional, every composition is crafted to stop the scroll.',
    },
    {
      icon: '🎯',
      title: 'Purpose-Driven',
      desc: 'Great visuals aren\'t just pretty they communicate, connect, and convert. We design with intent.',
    },
    {
      icon: '🌀',
      title: 'Always Evolving',
      desc: 'Trends shift. We stay ahead. Our team is in constant motion studying, experimenting, and refining.',
    },
    {
      icon: '🤝',
      title: 'Customer-First',
      desc: 'Every project starts with understanding the client\’s vision. Whether it\’s an artist shaping a sound or a brand building an identity, we focus on delivering visuals that connect emotionally and communicate the story clearly.',
    },
  ];

  const timeline = [
    {
      year: '2022',
      title: 'The Start of Faded Visuals',
      body: 'Faded Visuals began as a passion for creating digital artwork and cover art for artists. What started as experimental designs quickly grew into a creative outlet focused on helping artists stand out visually.',
    },
    {
      year: '2023',
      title: 'Building the Portfolio',
      body: 'Expanded into working with more creatives and developing skills in cover art, digital illustration, and visual storytelling while growing an online presence.',
    },
    {
      year: '2024',
      title: 'Expanding Services',
      body: 'Faded Visuals evolved beyond cover art to include logo design, motion graphics, lyric videos, DJ visuals, and apparel mockups — serving both artists and brands.',
    },
    {
      year: '2025',
      title: 'Freelance Creative Brand',
      body: 'Faded Visuals became a growing freelance creative brand focused on delivering bold visuals for musicians, businesses, and creatives.',
    },
    {
      year: 'Next',
      title: 'The Future',
      body: 'Expanding the brand with poster releases, stronger collaborations, and building a platform where art, music, and visual identity intersect.',
    },
  ];

  return (
    <div className="relative overflow-hidden">

      {/* ═══════════════════════════════════════════
          SECTION 1 — Full-width manifesto paragraphs
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px]" aria-hidden />

        <div className="max-w-7xl mx-auto">
          {/* Divider */}
          <RevealBlock>
            <div className="flex items-center gap-6 mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <span
                className="text-xs tracking-[0.35em] text-purple-500 uppercase font-medium shrink-0"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our Philosophy
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — large pull quote */}
            <RevealBlock delay={0.1}>
              <blockquote>
                <p
                  className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  "Visual identity is not decoration. It is{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    the first conversation
                  </span>{' '}
                  you have with the world."
                </p>
              </blockquote>
            </RevealBlock>

            {/* Right — body paragraphs */}
            <div className="flex flex-col gap-6">
              <RevealBlock delay={0.2}>
                <p
                  className="text-gray-400 text-[15px] leading-[1.85] hover:text-gray-300 transition-colors duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  We believe every artist and every brand deserves a visual identity that reflects their true level.
                  Too often, incredible talent is paired with visuals that fall short of their vision.
                  Faded Visuals exists to close that gap.
                </p>
              </RevealBlock>
              <RevealBlock delay={0.3}>
                <p
                  className="text-gray-400 text-[15px] leading-[1.85] hover:text-gray-300 transition-colors duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  From the first mood board to the final frame, every project is approached with obsessive attention to detail.
                  We ask the questions others overlook, push beyond the brief, and create visuals that exceed expectations — sometimes even redefining what the client originally imagined.
                </p>
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — Values grid
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent to-[#0f0f0f]/40">
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-[600px] h-[400px] rounded-full bg-purple-900/8 blur-[120px]" aria-hidden />

        <div className="max-w-7xl mx-auto">
          <RevealBlock className="mb-14">
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <span
                className="text-xs tracking-[0.35em] text-purple-500 uppercase font-medium shrink-0"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                What We Stand For
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <ValuePill key={v.title} delay={i * 0.1} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — Timeline + second body copy
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 px-6">
        <div className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-900/8 blur-[100px]" aria-hidden />

        <div className="max-w-7xl mx-auto">
          <RevealBlock className="mb-14">
            <div className="flex items-center gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              <span
                className="text-xs tracking-[0.35em] text-purple-500 uppercase font-medium shrink-0"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Our Journey
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          </RevealBlock>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Timeline */}
            <div className="flex flex-col gap-10">
              {timeline.map((t, i) => (
                <TimelineItem key={t.year} delay={i * 0.1} {...t} />
              ))}
            </div>

            {/* Closing copy */}
            <div className="flex flex-col gap-8 lg:pt-2">
              <RevealBlock delay={0.1}>
                <p
                  className="text-gray-400 text-[15px] leading-[1.85] hover:text-gray-300 transition-colors duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                 What started as a passion for creating visuals has grown into Faded Visuals a creative brand trusted by independent artists, creatives, and businesses looking for bold, meaningful design.
                </p>
              </RevealBlock>

              <RevealBlock delay={0.2}>
                <p
                  className="text-gray-400 text-[15px] leading-[1.85] hover:text-gray-300 transition-colors duration-300"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Over time, Faded Visuals has worked with independent artists, creatives, and brands across a range of projects from cover art and motion graphics to logo design, apparel mockups, and digital artwork.
                  Each collaboration is different, but the approach remains the same: creating visuals that capture identity, tell a story, and leave a lasting impression.
                  What unites all of it is our voice  distinctive, premium, faded at the edges but sharp at the core.
                </p>
              </RevealBlock>

              {/* Closing CTA card */}
              <RevealBlock delay={0.3}>
                <div className="relative rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-transparent p-8 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p
                    className="text-white font-semibold text-lg mb-2"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    Ready to create something iconic?
                  </p>
                  <p className="text-gray-500 text-sm mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Let's talk about your project. No pitch decks, just real conversation.
                  </p>
                  <motion.a
                  href="/contact"
                  whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(168,85,247,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="px-7 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-sm font-medium tracking-wide relative overflow-hidden group/btn inline-block"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="relative z-10">Get In Touch</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                </motion.a>
                </div>
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContent;
