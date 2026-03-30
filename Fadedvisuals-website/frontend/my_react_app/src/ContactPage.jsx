import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ContactForm from './components/ContactForm';
import SchedulerCard from './components/SchedulerCard';

const ContactPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        aria-hidden
      />

      <ScrollProgress />
      <Navbar activePage="contact" />

      <main className="relative pt-32 pb-24 px-6">
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute top-1/4 left-1/4 w-[600px] h-[600px]"
          style={{ 
            background: 'radial-gradient(ellipse, rgba(88,28,135,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 right-1/4 w-[500px] h-[500px]"
          style={{ 
            background: 'radial-gradient(circle, rgba(88,28,135,0.06) 0%, transparent 70%)',
            filter: 'blur(50px)'
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Let's Talk
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gray-500 text-lg"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Get in touch with our team or schedule a consultation
            </motion.p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Right Column - Scheduler */}
            <div>
              <SchedulerCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;