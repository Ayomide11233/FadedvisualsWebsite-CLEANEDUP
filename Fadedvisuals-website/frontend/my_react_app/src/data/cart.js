/* ═══════════════════════════════════════════════════════════
   CART DATA
   Mock cart items for demonstration
═══════════════════════════════════════════════════════════ */

export const MOCK_CART_ITEMS = [
  {
    id: 'cart-1',
    productId: 'celestial-chaos',
    title: 'Celestial Chaos',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    price: 20,
    size: 'M',
    frame: 'Gold',
    quantity: 1,
  },
  {
    id: 'cart-2',
    productId: 'ethereal-gaze',
    title: 'Ethereal Gaze',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
    price: 20,
    size: 'L',
    frame: 'Black',
    quantity: 2,
  },
  {
    id: 'cart-3',
    productId: 'midnight-bloom',
    title: 'Midnight Bloom',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    price: 20,
    size: 'S',
    frame: 'No Frame',
    quantity: 1,
  },
];

export const SHIPPING_RATES = {
  // 'US': 12.99,    // United States
  'CA': 30.00,    // Canada
  'CA-pk': 0.00,    // Canada Pick up
  'NG': 5.00,    // Nigeria
  'NG-pk': 0.00,    // Nigeria
  // 'GB': 20.00,    // United Kingdom
  // 'AU': 25.00,    // Australia
  'DEFAULT': 18.00 // Default for other countries
};

// Get shipping cost by country code
export const getShippingCost = (countryCode) => {
  console.log('💰 Getting shipping cost for code:', countryCode);
  console.log('📋 Available rates:', SHIPPING_RATES);
  
  const cost = SHIPPING_RATES[countryCode];
  
  if (cost === undefined) {
    console.log('⚠️ Code not found! Using DEFAULT');
    return SHIPPING_RATES.DEFAULT;
  }
  
  console.log('✅ Shipping cost:', cost);
  return cost;
};

export const FREE_SHIPPING_THRESHOLD = null;