import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import PricingModal from './components/PricingModal';
import ServiceTierCard from './components/ServiceTierCard';

/* ═══════════════════════════════════════════════════════════
   SERVICE DATA  — 4 categories × 3 tiers each
═══════════════════════════════════════════════════════════ */
const SERVICES = [
  {
    id: 'branding',
    name: 'Branding Package',
    icon: '✦',
    subtitle: 'Build an identity that commands attention',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    tiers: [
      {
        label: 'Basic',
        price: '$150',
        tagline: 'Clean identity for solo artists',
        description:
          'A focused branding package to get your visual identity off the ground with a professional logo and core brand assets.',
        features: [
          'Custom logo (2 concepts)',
          '3 revision rounds',
          'PNG & SVG source files',
          'Brand colour palette',
          '7-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$350',
        tagline: 'Full identity system',
        description:
          'A complete branding suite covering everything you need to look cohesive and professional across all platforms.',
        features: [
          "Brand colour palette",
          "Typography pairing guide",
          "Social media templates ×4",
          "Brand style guide (PDF)",
          "5 revision rounds",
          "5-day delivery",
        ],
      },
      {
        label: 'Premium',
        price: '$650-850',
        tagline: 'Iconic brand presence',
        description:
          'The full creative direction package — strategy, identity, motion, and merch. Built to make your brand unforgettable.',
        features: [
          "2 Animated logo (seamless loop)",
          "Full color & typography system",
          "EPK design (4 pages)",
          "Brand strategy session (1 hr)",
          "Unlimited revisions",
          "3-day express delivery",
          "2-month post-delivery support",
        ],
      },
    ],
  },
  {
    id: 'music-visuals-suite',
    name: 'Music Visuals Suite',
    icon: '◈',
    subtitle: 'A complete visual ecosystem for your sound',
    image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200',
    tiers: [
      {
        label: 'Basic',
        price: '$299',
        tagline: 'The Single Launch Starter',
        description:
          'Everything you need to drop a single with impact: professional cover art paired with high-energy kinetic lyrics.',
        features: [
          '1 Premium Cover Art Concept',
          'Kinetic Typography Lyric Video',
          'Spotify Canvas (8s Loop)',
          '3000 × 3000 px Master Files',
          '2 Revision Rounds',
          '5-Day Delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$599',
        tagline: 'The EP & Social Powerhouse',
        description:
          'A cohesive branding kit for an EP release, including motion graphics and a social media content suite.',
        features: [
          'Everything in Essential',
          'EP/Album Cover + 3 Single Variations',
          'Motion Graphic Lyric Video (4K)',
          'Social Media Kit (Banners & Profile Art)',
          '5 Social Media Promo Clips',
          '4 Revision Rounds',
          '7-Day Delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$1249',
        tagline: 'Full Album & Stage Experience',
        description:
          'The ultimate artist package. Full album rollout visuals plus a professional VJ pack for live performances.',
        features: [
          'Everything in Signature',
          'Cinematic Animated Lyric Video',
          'DJ/Live VJ Visual Pack (15 Loops)',
          'Custom Stage Banner Designs',
          'Unlimited Revisions',
          'Priority 5-Day Express Delivery',
        ],
      },
    ],
  },
  {
    id: 'apparel',
    name: 'Apparel Mockups Package',
    icon: '▣',
    subtitle: 'Merch that moves units',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    tiers: [
      {
        label: 'Basic',
        price: '$120',
        tagline: 'Single garment mockup',
        description:
          'A clean, premium mockup for one garment — ready for your online store or pre-order campaign.',
        features: [
          '1 garment type',
          '2 colourways',
          'Front + back views',
          'High-res PNG delivery',
          '3-day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$250',
        tagline: 'Full merch line mockup',
        description:
          'A complete mockup set for your merch drop — multiple garments, colourways, and lifestyle context shots.',
        features: [
          'Everything in Basic',
          '3 garment types',
          '3 colourways each',
          '2 revision rounds',
          'AI model showcase (1–2 images)',
          '4-day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$550–750',
        tagline: 'Full campaign visual pack',
        description:
          'A full merch campaign package — mockups, social graphics, banner ads, and a launch-ready visual kit.',
        features: [
          "2D clothing mockups (front, back, detail views)",
          "Realistic garment visualization",
          "Production-ready tech pack (PDF)",
          "AI models (multiple poses)",
          "AI lifestyle or studio imagery",
          'Unlimited revisions',
          '7-day express delivery',
        ],
      },
      
    ],
  },
  {
    id: 'event-design',
    name: 'Event Design Package',
    icon: '◆',
    subtitle: 'Designing experiences that leave a lasting impression',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29c1c0b8e?w=800&q=80',
    tiers: [
      {
        label: 'Basic',
        price: '$100-220',
        tagline: 'Essential event visuals',
        description:
          'A clean and professional design package for events, providing core visuals to set the tone and communicate your event clearly.',
        features: [
          'Event invitation (print & digital)',
          'Flyer or announcement design',
          '2 revision rounds',
          'High-res print & web files',
          '4–5 day delivery',
        ],
      },
      {
        label: 'Moderate',
        price: '$160-350',
        tagline: 'Cohesive event branding',
        description:
          'A complete static design suite with consistent visual identity across all event materials, ensuring a polished and unified look.',
        features: [
          'Everything in Basic',
          'Menu card or program design',
          'Custom design system (colors & typography)',
          '3 revision rounds',
          'Print-ready + digital formats',
          '5–6 day delivery',
        ],
      },
      {
        label: 'Premium',
        price: '$250-800',
        tagline: 'Full visual experience',
        description:
          'A premium event design experience combining static and motion visuals to create immersive, high-impact event presentation.',
        features: [
          'Everything in Moderate',
          'Animated invitation or motion asset',
          'Social media countdown visuals',
          'Multiple format exports (reels, stories, print)',
          'Unlimited revisions',
          'Priority 5-day delivery',
        ],
      },
    ],
  }
];

/* ═══════════════════════════════════════════════════════════
   SERVICE CATEGORY ROW
═══════════════════════════════════════════════════════════ */
const ServiceCategory = ({ service, onCardClick, modalOpen }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} id={service.id} className="mb-24 last:mb-0">
      {/* Category header */}
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -28 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-5 mb-3"
      >
        <span
          className="text-3xl text-purple-500 flex-shrink-0"
          style={{ textShadow: '0 0 24px rgba(168,85,247,0.7)' }}
        >
          {service.icon}
        </span>
        <div>
          <h3
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
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

      {/* Thin category divider */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 h-px origin-left"
        style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.4) 0%, transparent 60%)' }}
      />

      {/* 3-col tier grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        animate={modalOpen ? { scale: 0.987, opacity: 0.5 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
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
   SERVICE PAGE HERO
═══════════════════════════════════════════════════════════ */
const ServiceHero = () => (
  <section className="relative pt-40 pb-20 px-6 overflow-hidden">
    {/* Background glow */}
    <div
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
      style={{ background: 'radial-gradient(ellipse, rgba(88,28,135,0.18) 0%, transparent 70%)' }}
      aria-hidden
    />

    <div className="relative z-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow */}
        <span
          className="inline-block text-xs tracking-[0.35em] uppercase text-purple-500 font-medium mb-5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          What We Offer
        </span>

        {/* Headline */}
        <h1
          className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.0] mb-6"
          style={{ fontFamily: "'Unbounded', sans-serif" }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 40%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            OUR
          </span>
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SERVICES
          </span>
        </h1>

        {/* Sub copy */}
        <p
          className="text-gray-400 text-base max-w-xl leading-relaxed mb-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Every service comes in three tiers — Basic, Moderate, and Premium.
          Pick the depth that fits your project, click a card to see full details, and hit Get Started.
        </p>

        {/* Stat row */}
        <div className="flex flex-wrap gap-8">
          {[
            { value: '6', label: 'Service categories' },
            { value: '18', label: 'Packages available' },
            { value: '200+', label: 'Projects delivered' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  background: 'linear-gradient(135deg, #c084fc, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </span>
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
  </section>
);

/* ═══════════════════════════════════════════════════════════
   SERVICES PAGE  — root component
═══════════════════════════════════════════════════════════ */
const ServicePage = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal  = useCallback((tier, serviceName) => setActiveModal({ tier, serviceName }), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const modalOpen = Boolean(activeModal);

  // Handle hash scrolling on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Wait for DOM to be ready, then scroll
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
        aria-hidden="true"
      />

      <ScrollProgress />
      <Navbar activePage="services" />

      <main>
        {/* Hero */}
        <ServiceHero />

        {/* All service categories */}
        <section
          className="relative px-6 pb-32 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)' }}
        >
          {/* Ambient glows */}
          <div
            className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px]"
            style={{ background: 'radial-gradient(circle, rgba(88,28,135,0.07) 0%, transparent 70%)' }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-1/3 left-0 w-[400px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(88,28,135,0.06) 0%, transparent 70%)' }}
            aria-hidden
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            {SERVICES.map((service) => (
              <ServiceCategory
                key={service.id}
                service={service}
                onCardClick={openModal}
                modalOpen={modalOpen}
              />
            ))}

            {/* Bottom CTA note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center pt-8 border-t"
              style={{ borderColor: 'rgba(168,85,247,0.1)' }}
            >
              <p
                className="text-gray-600 text-xs mb-3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Need something outside these packages?
              </p>
              <motion.a
                href='/contact'
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: '0 8px 24px rgba(168, 85, 247, 0.45)',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="px-8 py-3 rounded-full text-sm font-medium tracking-wide relative overflow-hidden group outline-none focus:outline-none"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: 'linear-gradient(135deg, #9333ea, #7c3aed)',
                  boxShadow: '0 4px 16px rgba(147,51,234,0.25)',
                  WebkitTapHighlightColor: 'transparent',

                  borderRadius: '9999px', 
                  display: 'inline-block',
                  textDecoration: 'none',
                  color: 'white'
                }}
              >
                <span className="relative z-10">Request a Custom Quote</span>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #9333ea)' }} />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal — AnimatePresence outside all sections */}
      <AnimatePresence>
        {activeModal && (
          <PricingModal
            key="service-page-modal"
            tier={activeModal.tier}
            serviceName={activeModal.serviceName}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicePage;
