import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import ServiceTierCard from './ServiceTierCard';
import PricingModal from './PricingModal';

/* ═══════════════════════════════════════════════════════════
   SERVICE DATA
   Each service category has 3 tiers: Basic / Moderate / Premium
═══════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: 'branding',
    name: 'Branding Package',
    icon: '✦',
    subtitle: 'Build an identity that commands attention',
    tiers: [
      {
        label: 'Basic',
        price: '$149',
        tagline: 'Clean identity for solo artists',
        description: 'A focused branding package to get your visual identity off the ground with a professional logo and core brand assets.',
        features: [
          'Custom logo (2 concepts)',
          '3 revision rounds',
          'PNG, SVG source files',
          'Brand colour palette',
          '7-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$299',
        tagline: 'Full identity system',
        description: 'A complete branding suite covering everything you need to look cohesive and professional across all platforms.',
        features: [
          'Everything in Basic',
          'Logo variations (light/dark)',
          'Typography pairing guide',
          'Social media templates (6)',
          'Brand style guide (PDF)',
          '5 revision rounds',
          '5-day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$549',
        tagline: 'Iconic brand presence',
        description: 'The full creative direction package — strategy, identity, motion, and merch. Built to make your brand unforgettable.',
        features: [
          'Everything in Moderate',
          'Animated logo (loop)',
          'Merch mockup pack (3 items)',
          'EPK design (4 pages)',
          'Brand strategy session (1hr)',
          'Unlimited revisions',
          '3-day express delivery',
          '2-month support',
        ],
      },
    ],
  },
  {
    id: 'cover-art',
    name: 'Cover Art Package',
    icon: '◈',
    subtitle: 'Artwork that stops the scroll',
    tiers: [
      {
        label: 'Basic',
        price: '$99',
        tagline: 'Single + EP cover',
        description: 'A striking single cover that captures your sound and looks great on every streaming platform.',
        features: [
          '1 cover art concept',
          '2 revision rounds',
          '3000×3000px delivery',
          'Streaming-ready formats',
          '4-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$199',
        tagline: 'EP or album artwork',
        description: 'Full artwork for your EP or album, with variations for singles, social posts, and streaming banners.',
        features: [
          'Everything in Basic',
          '2 cover concepts',
          'Single art variations (3)',
          'Spotify/Apple canvas size',
          'Social media crop kit',
          '4 revision rounds',
          '5-day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$399',
        tagline: 'Album + animated canvas',
        description: 'Full album artwork package with animated loop for Canvas/Shorts, social kit, and exclusive digital collectible drop.',
        features: [
          'Everything in Moderate',
          'Animated cover loop (8s)',
          'Lyric snippet visual (1)',
          'Exclusive digital art drop',
          'Unlimited revisions',
          '3-day express delivery',
        ],
      },
    ],
  },
  {
    id: 'lyric-video',
    name: 'Lyric Video Package',
    icon: '◉',
    subtitle: 'Visual storytelling for your sound',
    tiers: [
      {
        label: 'Basic',
        price: '$249',
        tagline: 'Clean kinetic typography',
        description: 'A polished lyric video with smooth kinetic text animation, synced to your track, ready for YouTube.',
        features: [
          'Up to 3-min track',
          'Kinetic text animation',
          '1080p HD delivery',
          '2 revision rounds',
          '7-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$449',
        tagline: 'Motion graphics + lyrics',
        description: 'Elevated lyric video with custom motion graphic elements, colour-graded visual backdrop and branded end card.',
        features: [
          'Everything in Basic',
          'Custom motion graphics',
          'Colour-graded backdrop',
          'Branded intro/outro',
          '4K delivery option',
          '3 revision rounds',
          '6-day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$799',
        tagline: 'Cinematic full production',
        description: 'Cinematic lyric video with fully illustrated or animated scenes, multilingual caption support, and social cuts.',
        features: [
          'Everything in Moderate',
          'Illustrated/animated scenes',
          'Up to 5-min track',
          'Multilingual caption version',
          '60s vertical cut (Reels/Shorts)',
          'Unlimited revisions',
          '5-day express delivery',
        ],
      },
    ],
  },
  {
    id: 'dj-visuals',
    name: 'DJ Visuals Package',
    icon: '⬡',
    subtitle: 'Immersive live stage experiences',
    tiers: [
      {
        label: 'Basic',
        price: '$199',
        tagline: 'Starter visual loop pack',
        description: 'A high-energy looping visual pack tailored to your brand, ready to drop straight into your VJ software.',
        features: [
          '5 seamless loop clips',
          'Branded colour palette',
          '1080p resolution',
          'Compatible with Resolume / VDMX',
          '7-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$399',
        tagline: 'Full set visual pack',
        description: 'A complete visual set with branded transitions, reactive elements, and a custom DJ logo sting.',
        features: [
          'Everything in Basic',
          '15 seamless loop clips',
          'Custom DJ logo sting (10s)',
          'Transition wipe pack (5)',
          '4K resolution option',
          '2 revision rounds',
          '6-day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$799',
        tagline: 'Full show production pack',
        description: 'A comprehensive live show visual suite — custom loops, reactive content, stage banners, and a 30-min pre-cut set.',
        features: [
          'Everything in Moderate',
          '30 seamless loop clips',
          'Pre-cut 30-min VJ set',
          'Stage banner designs (2)',
          'Crowd cam overlay graphics',
          'Unlimited revisions',
          '5-day express delivery',
          '1-month post-show support',
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   SERVICE CATEGORY BLOCK
═══════════════════════════════════════════════════════════ */
const ServiceCategory = ({ service, onCardClick, modalOpen }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="mb-20 last:mb-0">
      {/* Category header */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 mb-8"
      >
        <span
          className="text-2xl text-purple-500"
          style={{ textShadow: '0 0 20px rgba(168,85,247,0.6)' }}
        >
          {service.icon}
        </span>
        <div>
          <h3
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            {service.name}
          </h3>
          <p
            className="text-gray-500 text-sm mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {service.subtitle}
          </p>
        </div>
      </motion.div>

      {/* Tier cards — 3 column grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        animate={modalOpen ? { scale: 0.985, opacity: 0.55 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {service.tiers.map((tier, i) => (
          <ServiceTierCard
            key={tier.label}
            tier={tier}
            index={i}
            isPopular={tier.label === 'Moderate'}
            serviceName={service.name}
            onClick={onCardClick}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════════════════ */
const ServicesSection = () => {
  const [activeModal, setActiveModal] = useState(null); // { tier, serviceName }

  const openModal  = useCallback((tier, serviceName) => setActiveModal({ tier, serviceName }), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const modalOpen = Boolean(activeModal);

  return (
    <>
      <section
        id="services"
        className="relative py-32 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)' }}
      >
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.1) 0%, transparent 70%)', top: '-60px' }}
          aria-hidden />
        <div className="pointer-events-none absolute bottom-1/3 right-0 w-[400px] h-[400px]"
          style={{ background: 'radial-gradient(circle, rgba(88,28,135,0.07) 0%, transparent 70%)' }}
          aria-hidden />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <span
              className="text-xs tracking-[0.3em] uppercase text-purple-500 font-medium block mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              What We Offer
            </span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              <span style={{
                background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                SERVICES
              </span>
            </h2>
            <p
              className="text-gray-500 text-sm mt-4 max-w-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Every service comes in three tiers — pick the depth that fits your project.
              Click any card to see full details and get started.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-16 origin-left"
          >
            <div className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.4), transparent)' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0"
              style={{ boxShadow: '0 0 8px 2px rgba(168,85,247,0.5)' }} />
            <div className="flex-1 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.15))' }} />
          </motion.div>

          {/* All service categories */}
          {SERVICES.map((service) => (
            <ServiceCategory
              key={service.id}
              service={service}
              onCardClick={openModal}
              modalOpen={modalOpen}
            />
          ))}

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-gray-600 text-xs mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Need something custom? Reach out for a bespoke quote.
          </motion.p>
        </div>
      </section>

      {/* Modal — AnimatePresence outside section so it overlays everything */}
      <AnimatePresence>
        {activeModal && (
          <PricingModal
            key="service-modal"
            tier={activeModal.tier}
            serviceName={activeModal.serviceName}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesSection;
