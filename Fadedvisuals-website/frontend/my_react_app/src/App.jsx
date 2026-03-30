import React from 'react';
import { useEffect } from 'react';
import { initializeStripe } from './services/stripeService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Collectables from './components/Collectables';
import HorizontalScrollSection from './components/HorizontalScrollSection';
import ReviewTicker from './components/ReviewTicker';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import Chatbot from './components/ChatAgent';

function App() {
  useEffect(() => {
    // Initialize Stripe on app load
    initializeStripe().catch(err => {
      console.error('Failed to initialize Stripe:', err);
    });
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
      <Navbar activePage="home" />

      <main>
        <Hero />
        <Services />
        <Collectables />
      </main>

      <Footer />

      {/* Floating Chatbot - Always visible, NO login required! */}
      <Chatbot />
    </div>
  );
}

export default App;