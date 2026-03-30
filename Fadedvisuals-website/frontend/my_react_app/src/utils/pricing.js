import { PRICING } from '../data/products';

/**
 * Calculate the total price for a product based on selections
 * @param {number} basePrice - Product base price
 * @param {string} selectedSize - Selected size (S, M, L, XL)
 * @param {string} selectedFrame - Selected frame label
 * @param {number} quantity - Quantity selected
 * @returns {object} - { total, breakdown }
 */
export const calculatePrice = (basePrice, selectedSize, selectedFrame, quantity = 1) => {
  // Base price
  let subtotal = basePrice;
  
  // Size upcharge
  const sizeUpcharge = PRICING.sizeUpcharge[selectedSize] || 0;
  subtotal += sizeUpcharge;
  
  // Frame upcharge (only if a frame is selected, not "No Frame")
  const frameUpcharge = (selectedFrame && selectedFrame !== 'No Frame') 
    ? PRICING.frameUpcharge 
    : 0;
  subtotal += frameUpcharge;
  
  // Total with quantity
  const total = subtotal * quantity;
  
  return {
    total,
    breakdown: {
      basePrice,
      sizeUpcharge,
      frameUpcharge,
      subtotal,
      quantity,
    },
  };
};

/**
 * Format price for display
 * @param {number} price - Price to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};
