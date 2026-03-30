import React from 'react';
import { motion } from 'framer-motion';

const SHIPPING_OPTIONS = [
  { 
    country: 'Canada',
    flag: '🇨🇦',
    options: [
      { code: 'CA', label: 'Delivery ($30.00)' },
      { code: 'CA-pk', label: 'Pickup (Free)' }
    ]
  },
  { 
    country: 'Nigeria',
    flag: '🇳🇬',
    options: [
      { code: 'NG', label: 'Delivery ($5.00)' },
      { code: 'NG-pk', label: 'Pickup (Free)' }
    ]
  },
  { 
    country: 'Other',
    flag: '🌍',
    options: [
      { code: 'DEFAULT', label: 'International Delivery ($18.00)' }
    ]
  }
];

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  const isPickup = selectedCountry?.endsWith('-pk');
  
  // DEBUG: Log the selected country
  console.log('🌍 Selected Country Code:', selectedCountry);
  
  return (
    <div className="mb-4">
      <label 
        className="block text-sm font-medium text-gray-400 mb-2"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Shipping Method
      </label>
      <select
        value={selectedCountry}
        onChange={(e) => {
          console.log('📦 New selection:', e.target.value); // DEBUG
          onCountryChange(e.target.value);
        }}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/20 text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {SHIPPING_OPTIONS.map((group) => (
          <optgroup 
            key={group.country} 
            label={`${group.flag} ${group.country}`}
            style={{ background: '#0f0f0f', color: '#9ca3af' }}
          >
            {group.options.map((option) => (
              <option 
                key={option.code} 
                value={option.code}  // ← CRITICAL: Make sure this is the code!
                style={{ background: '#1a1a1a', color: 'white', paddingLeft: '20px' }}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      
      {/* Show pickup notice */}
      {isPickup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2 text-xs text-green-400 bg-green-400/10 rounded-lg p-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Free pickup - No shipping charges</span>
        </motion.div>
      )}
    </div>
  );
};

export default CountrySelector;