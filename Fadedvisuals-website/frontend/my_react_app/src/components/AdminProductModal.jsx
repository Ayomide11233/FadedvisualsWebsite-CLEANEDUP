import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DEFAULT_FRAMES = [
  { label: 'No Frame', color: null },
  { label: 'White', color: '#ffffff' },
  { label: 'Gold', color: '#d4af37' },
  { label: 'Black', color: '#1a1a1a' },
  { label: 'Natural', color: '#8b7355' },
];

const CATEGORIES = ['prints', 'apparel', 'collectibles'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'];

// ── Small helpers ─────────────────────────────────────────────────────────────

const Field = ({ label, children, error }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{
      display: 'block', marginBottom: '6px',
      fontFamily: "'Unbounded', sans-serif", fontSize: '0.58rem',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: error ? '#f87171' : '#6b7280',
    }}>{label}</label>
    {children}
    {error && <p style={{ color: '#f87171', fontSize: '0.7rem', marginTop: '4px', fontFamily: "'Inter', sans-serif" }}>{error}</p>}
  </div>
);

const inputStyle = (focused) => ({
  width: '100%', boxSizing: 'border-box',
  background: focused ? 'rgba(88,28,135,0.08)' : 'rgba(255,255,255,0.03)',
  border: `1px solid ${focused ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.08)'}`,
  borderRadius: '8px', padding: '10px 14px',
  color: '#f3f4f6', fontSize: '0.875rem',
  fontFamily: "'Inter', sans-serif", outline: 'none',
  transition: 'all 0.2s ease',
});

const FocusInput = ({ value, onChange, placeholder, type = 'text', multiline }) => {
  const [focused, setFocused] = useState(false);
  const props = {
    value, onChange, placeholder,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: inputStyle(focused),
  };
  return multiline
    ? <textarea rows={3} {...props} />
    : <input type={type} {...props} />;
};

// ── Main Modal ────────────────────────────────────────────────────────────────

const AdminProductModal = ({ isOpen, onClose, product, onSaved }) => {
  const isEdit = Boolean(product);
  const fileRef = useRef(null);

  const blank = {
    slug: '', title: '', price: '', category: 'prints',
    description: '', details: '', shipping: '',
    sizes: ['S', 'M', 'L'], in_stock: true,
    hasFrames: true, image_url: '',
  };

  const [form, setForm] = useState(blank);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && product) {
      setForm({
        slug: product.slug || '',
        title: product.title || '',
        price: String(product.price || ''),
        category: product.category || 'prints',
        description: product.description || '',
        details: product.details || '',
        shipping: product.shipping || '',
        sizes: product.sizes || ['S', 'M', 'L'],
        in_stock: product.in_stock !== false,
        hasFrames: Boolean(product.frames && product.frames.length > 0),
        image_url: product.image_url || '',
      });
      setImagePreview(product.image_url ? `${API_BASE}${product.image_url}` : null);
    } else {
      setForm(blank);
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
    setApiError('');
  }, [product, isOpen]);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Required';
    if (!form.slug.trim()) e.slug = 'Required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid number required';
    if (form.sizes.length === 0) e.sizes = 'Select at least one size';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiError('');
    setLoading(true);
  
    const token = localStorage.getItem('token');
    
    // 1. Base URL - Based on your main.py routers
    const baseUrl = `${API_BASE}/products`; 
  
    // 2. THE FIX: Get the numeric ID for the URL path
    // Using product.id (the integer) instead of product.slug (the string)
    const productId = product ? parseInt(product.id || product._id) : null;

    if (isEdit && (productId === undefined || productId === null || isNaN(productId))) {
      console.error("DEBUG: The product object is missing an ID:", product);
      setApiError("Technical Error: Product ID is missing. Check console.");
      setLoading(false);
      return;
    }
  
    // If editing, we MUST have a numeric ID or the backend returns 422
    const url = isEdit ? `${baseUrl}/${productId}` : `${baseUrl}/`;
    const method = isEdit ? 'PUT' : 'POST';
  
    try {
      // 3. Prepare the Clean Payload
      const payload = {
        title: form.title.trim(),
        // Remove special characters like ./ from the slug before sending
        slug: form.slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        price: parseFloat(form.price),
        category: form.category,
        description: form.description || "",
        details: form.details || "",
        shipping: form.shipping || "",
        sizes: form.sizes,
        // id: parseInt(product.id),
        // Default to empty list if no frames; FastAPI models prefer [] over null
        ...(isEdit && { id: productId }),
        frames: form.hasFrames ? DEFAULT_FRAMES : [],
        in_stock: form.in_stock,
      };

      if (isEdit) {
        payload.id = productId;
      }
  
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Pulls the specific error message from FastAPI's validation detail
        const errorMsg = data.detail?.[0]?.msg || data.detail || 'Operation failed';
        throw new Error(errorMsg);
      }
  
      let savedProduct = data;
  
      // 4. Handle Image Upload (only if a new file was selected)
      if (imageFile && savedProduct.id) {
        const fd = new FormData();
        fd.append('file', imageFile);
        
        const imgRes = await fetch(`${baseUrl}/${savedProduct.id}/image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd,
        });
        
        const imgData = await imgRes.json();
        if (!imgRes.ok) throw new Error(imgData.detail || 'Image upload failed');
        savedProduct = imgData;
      }
  
      onSaved(savedProduct);
      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)', zIndex: 100,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.97 }} // Starts a bit higher up
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.97 }}
            style={{
              position: 'fixed',
              top: '40px',             // <--- Anchors it 40px from the top
              left: '50%',
              transform: 'translateX(-50%)', // <--- Only centers horizontally now
              width: '95%',
              maxWidth: '560px',
              maxHeight: 'calc(100vh - 80px)', // <--- Prevents it from going off-screen
              overflowY: 'auto',
              background: '#121212',
              border: '1px solid rgba(192,132,252,0.2)',
              borderRadius: '20px',
              padding: '32px',
              zIndex: 101,
              boxSizing: 'border-box',
              // Optional: Add a nice shadow to make it pop from the background
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{
                fontFamily: "'Unbounded', sans-serif", fontSize: '1rem',
                color: '#c084fc', margin: 0,
              }}>
                {isEdit ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Image Section */}
            <Field label="Product Image">
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  height: '160px', borderRadius: '12px', cursor: 'pointer',
                  border: '1px dashed rgba(192,132,252,0.3)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative',
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <p style={{ fontSize: '0.75rem' }}>Click to upload</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Title" error={errors.title}>
                <FocusInput value={form.title} onChange={set('title')} placeholder="Product Name" />
              </Field>
              <Field label="Slug" error={errors.slug}>
                <FocusInput value={form.slug} onChange={set('slug')} placeholder="url-slug" />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Price" error={errors.price}>
                <FocusInput value={form.price} onChange={set('price')} type="number" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={set('category')} style={inputStyle(false)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <FocusInput value={form.description} onChange={set('description')} multiline />
            </Field>

            <Field label="Available Sizes" error={errors.sizes}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {SIZE_OPTIONS.map(size => {
                  const isSelected = form.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      style={{
                        padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                        fontFamily: "'Unbounded', sans-serif", fontSize: '0.6rem',
                        background: isSelected ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.04)',
                        color: isSelected ? '#c084fc' : '#6b7280',
                        border: `1px solid ${isSelected ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { key: 'in_stock', label: 'Availability', onLabel: 'In Stock', offLabel: 'Sold Out' },
                { key: 'hasFrames', label: 'Frames', onLabel: 'Enabled', offLabel: 'Disabled' },
              ].map(({ key, label, onLabel, offLabel }) => (
                <div key={key}>
                  <p style={{ fontSize: '0.58rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                    style={{
                      width: '100%', padding: '9px', borderRadius: '8px', cursor: 'pointer',
                      fontFamily: "'Unbounded', sans-serif", fontSize: '0.6rem',
                      background: form[key] ? 'rgba(192,132,252,0.1)' : 'rgba(255,255,255,0.04)',
                      color: form[key] ? '#c084fc' : '#6b7280',
                      border: `1px solid ${form[key] ? 'rgba(192,132,252,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    {form[key] ? onLabel : offLabel}
                  </button>
                </div>
              ))}
            </div>

            {apiError && <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '16px' }}>{apiError}</div>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
                  color: '#fff', cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminProductModal;