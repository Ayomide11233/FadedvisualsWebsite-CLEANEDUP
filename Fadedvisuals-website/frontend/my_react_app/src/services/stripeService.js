import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from '../config/api';

let stripePromise = null;

// ─── Constants ──────────────────────────────────────────────────────────────
const ZERO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'VND', 'IDR', 'BIF', 'GNF', 'MGA', 'PYG', 'RWF', 'UGX', 'XAF', 'XOF'];

const COUNTRY_CURRENCY_MAP = {
  NA: 'NAD', ZA: 'ZAR', GB: 'GBP', DE: 'EUR', FR: 'EUR', 
  IT: 'EUR', ES: 'EUR', NL: 'EUR', AU: 'AUD', CA: 'CAD', 
  NG: 'NGN', KE: 'KES', GH: 'GHS', IN: 'INR', EU: 'EUR'
};

// ─── Location & Rate Helpers ────────────────────────────────────────────────
/**
 * Detects user country via IP.
 */
export const detectUserCountry = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country_code || 'US';
  } catch {
    console.warn('Country detection failed, defaulting to US');
    return 'US';
  }
};

/**
 * Fetches exchange rate from USD to target.
 */
export const getExchangeRate = async (targetCurrency) => {
  if (targetCurrency === 'USD') return 1;
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`);
    const data = await res.json();
    return data.rates[targetCurrency] ?? null;
  } catch {
    console.warn('Exchange rate fetch failed');
    return null;
  }
};

/**
 * CORE TOGGLE HELPER: Call this once on App load.
 * Returns everything needed to handle a USD/Local toggle in the UI.
 */
export const getCurrencyContext = async () => {
  const countryCode = await detectUserCountry();
  const localCurrency = COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
  const rate = await getExchangeRate(localCurrency);

  return {
    countryCode,
    localCurrency: rate ? localCurrency : 'USD',
    rate: rate ?? 1,
    isZeroDecimal: ZERO_DECIMAL_CURRENCIES.includes(localCurrency)
  };
};

// ─── Conversion Logic ───────────────────────────────────────────────────────
/**
 * Converts USD cents to target currency smallest units (e.g., cents or whole Yen).
 */
export const convertAmount = (usdCents, rate, targetCurrency) => {
  const usdDollars = usdCents / 100;
  const converted = usdDollars * rate;

  if (ZERO_DECIMAL_CURRENCIES.includes(targetCurrency)) {
    return Math.round(converted);
  }
  return Math.round(converted * 100);
};

// ─── Stripe Core ────────────────────────────────────────────────────────────
export const initializeStripe = async () => {
  if (stripePromise) return stripePromise;
  try {
    const response = await fetch(`${API_BASE_URL}/stripe/config`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    stripePromise = loadStripe(data.publishable_key);
    return stripePromise;
  } catch (error) {
    console.error('Stripe initialization error:', error);
    throw error;
  }
};

/**
 * Creates session and redirects.
 * @param {Array}  items - [{ price_id, quantity, unit_amount }]
 * @param {string} forceCurrency - The currency currently selected by the user toggle.
 */
export const redirectToCheckout = async (items, forceCurrency = 'USD') => {
  try {
    const rate = await getExchangeRate(forceCurrency);
    const effectiveRate = rate ?? 1;
    const finalCurrency = rate ? forceCurrency : 'USD';

    const convertedItems = items.map((item) => {
      // 1. Determine the base USD cents (fallback to price * 100 if unit_amount is missing)
      const baseAmount = item.unit_amount || (item.price * 100);

      return {
        product_id: item.product_id || item.id, // Handle both key types
        title: item.title || item.name,
        quantity: item.quantity || 1,
        size: item.size || null,
        frame: item.frame || null,
        // 2. Convert that base amount to the final currency
        unit_amount: convertAmount(baseAmount, effectiveRate, finalCurrency),
        currency: finalCurrency,
      };
    });

    console.log("PAYLOAD BEING SENT TO BACKEND:", JSON.stringify({ items: convertedItems, currency: finalCurrency }));

    // ... fetch call to /stripe/create-checkout-session remains the same

    // 3. Create Session
    const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: convertedItems,
        currency: finalCurrency,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cart`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Checkout failed');
    }

    const session = await response.json();
    window.location.href = session.url;
    
  } catch (error) {
    console.error('❌ Redirect error:', error);
    throw error;
  }
};