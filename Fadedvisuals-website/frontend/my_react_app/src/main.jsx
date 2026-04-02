import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import components normally
import App from './App.jsx';
import AuthPage from './Authpage.jsx';
import AboutPage from './AboutPage.jsx';
import ServicePage from './ServicePage.jsx';
import ShopPage from './ShopPage.jsx';
import CartPage from './CartPage.jsx';
import ProductDetailPage from './ProductDetailPage.jsx';
import ContactPage from './ContactPage.jsx';
import SuccessPage from './SuccessPage.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter provides the 'navigation context' to all child components */}
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<App />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/Authpage" element={<AuthPage />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Dynamic Route for Products */}
        <Route path="/shop/:id" element={<ProductDetailPage />} />

        {/* Support for .html extensions if you still need them */}
        <Route path="/about.html" element={<AboutPage />} />
        <Route path="/services.html" element={<ServicePage />} />
        <Route path="/shop.html" element={<ShopPage />} />
        <Route path="/cart.html" element={<CartPage />} />
        <Route path="/contact.html" element={<ContactPage />} />
        <Route path="/Authpage.html" element={<AuthPage />} />
        <Route path="/success.html" element={<SuccessPage />} />

        {/* Fallback/404 - Renders App if no route matches */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);