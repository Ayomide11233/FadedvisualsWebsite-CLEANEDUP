/**
 * config/api.js
 * =============
 * Single source of truth for all backend API URLs.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ROUTES = {
  // Auth
  LOGIN:   `${API_BASE_URL}/api/auth/login`,
  SIGNUP:  `${API_BASE_URL}/api/auth/signup`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,

  // Chat
  CHAT: `${API_BASE_URL}/chat/`,

  // Catalog
  PRODUCTS: `${API_BASE_URL}/products/`,
  SERVICES: `${API_BASE_URL}/services/`,
  
  // Stripe
  STRIPE_CONFIG: `${API_BASE_URL}/stripe/config`,
  STRIPE_CHECKOUT: `${API_BASE_URL}/stripe/create-checkout-session`,
};

export default API_ROUTES;