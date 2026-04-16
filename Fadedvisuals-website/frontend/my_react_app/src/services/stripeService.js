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
 * Handles both raw item arrays (Cart) and full payloads (Buy Now).
 */
export const redirectToCheckout = async (data, forceCurrency = 'USD') => {
  try {
    let finalPayload;

    // CHECK: Is 'data' already a full payload (has success_url and items)?
    if (data.items && data.success_url) {
      finalPayload = data;
    } else {
      // Otherwise, assume 'data' is a raw array of items (The Cart flow)
      const items = Array.isArray(data) ? data : [data];
      const rate = await getExchangeRate(forceCurrency);
      const effectiveRate = rate ?? 1;
      const finalCurrency = (rate ? forceCurrency : 'USD').toLowerCase();

      const convertedItems = items.map((item) => {
        // Fallback to unit_amount or price
        const baseAmount = item.unit_amount || (item.price * 100) || 0;

        return {
          product_id: String(item.product_id || item.id),
          title: item.title || item.name || "Product",
          quantity: item.quantity || 1,
          size: item.size || "Standard",
          frame: item.frame || "No Frame",
          unit_amount: convertAmount(baseAmount, effectiveRate, finalCurrency.toUpperCase()),
          currency: finalCurrency,
        };
      });

      finalPayload = {
        items: convertedItems,
        currency: finalCurrency,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/shop`,
      };
    }

    console.log("SENDING TO BACKEND:", JSON.stringify(finalPayload));

    const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle FastAPI detail errors or general errors
      throw new Error(typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail));
    }

    const session = await response.json();
    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error("No checkout URL received from server");
    }
    
  } catch (err) {
    console.error("Checkout Error:", err);
    throw err;
  }
};