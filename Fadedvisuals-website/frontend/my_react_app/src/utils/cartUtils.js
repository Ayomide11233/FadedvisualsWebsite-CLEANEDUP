/* ═══════════════════════════════════════════════════════════
   CART UTILITY FUNCTIONS
   Manage cart state in localStorage
═══════════════════════════════════════════════════════════ */

const CART_STORAGE_KEY = 'faded_visuals_cart';

/**
 * Get cart items from localStorage
 */
export const getCartItems = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 */
export const saveCartItems = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
};

/**
 * Add item to cart
 * If item with same product + size + frame exists, increase quantity
 * Otherwise, add as new item
 */
export const addToCart = (product, selectedSize, selectedFrame, quantity = 1) => {
  const cartItems = getCartItems();
  
  // Check if item already exists (same product, size, frame)
  const existingItemIndex = cartItems.findIndex(
    (item) =>
      item.productId === product.id &&
      item.size === selectedSize &&
      item.frame === selectedFrame
  );

  if (existingItemIndex !== -1) {
    // Update quantity of existing item
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    const newItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      size: selectedSize,
      frame: selectedFrame || 'No Frame',
      quantity,
    };
    cartItems.push(newItem);
  }

  saveCartItems(cartItems);
  return cartItems;
};

/**
 * Remove item from cart
 */
export const removeFromCart = (itemId) => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter((item) => item.id !== itemId);
  saveCartItems(updatedCart);
  return updatedCart;
};

/**
 * Update item quantity
 */
export const updateCartItemQuantity = (itemId, newQuantity) => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.map((item) =>
    item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
  );
  saveCartItems(updatedCart);
  return updatedCart;
};

/**
 * Get total item count in cart
 */
export const getCartItemCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
};
