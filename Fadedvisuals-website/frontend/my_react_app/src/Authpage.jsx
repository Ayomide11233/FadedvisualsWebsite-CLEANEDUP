import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc'; 
import { FaApple } from 'react-icons/fa';

// ── Config ────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';



// --- Create this reusable component ---
const SocialLogins = () => {
  const handleSocialLogin = (provider) => {
    // Redirects to your FastAPI backend OAuth endpoint
    window.location.href = `${API_BASE}/api/auth/${provider}/login`;
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.07)' }}></div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '0.65rem' }}>
          <span style={{ background: '#251a31', padding: '0 10px', color: '#6b7280', fontFamily: "'Unbounded', sans-serif", textTransform: 'uppercase' }}>
            Or continue with
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <motion.button
          whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialLogin('google')}
          type="button"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: '0.8rem'
          }}
        >
          <FcGoogle size={18} /> Google
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSocialLogin('apple')}
          type="button"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)', color: '#fff', cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: '0.8rem'
          }}
        >
          <FaApple size={18} /> Apple
        </motion.button>
      </div>
    </div>
  );
};

// ── Validation (mirrors backend Pydantic rules) ───────────────────────────────
const validateSignup = ({ username, email, password }) => {
  const errors = {};
  if (!username || username.length < 3) errors.username = 'At least 3 characters.';
  else if (!/^[a-zA-Z0-9_\-]+$/.test(username)) errors.username = 'Letters, digits, _ and - only.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email required.';
  if (!password || password.length < 8) errors.password = 'At least 8 characters.';
  else {
    const missing = [];
    if (!/[A-Z]/.test(password)) missing.push('uppercase');
    if (!/[a-z]/.test(password)) missing.push('lowercase');
    if (!/\d/.test(password)) missing.push('digit');
    if (!/[@$!%*?&#^()_+=\-\[\]{}|\\:;"'<>,./]/.test(password)) missing.push('special char');
    if (missing.length) errors.password = `Needs: ${missing.join(', ')}.`;
  }
  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email required.';
  if (!password) errors.password = 'Password required.';
  return errors;
};

// ── Sub-components ────────────────────────────────────────────────────────────

const InputField = ({ label, type = 'text', value, onChange, error, placeholder, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="relative mb-5">
      <label
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: error ? '#f87171' : focused ? '#c084fc' : '#6b7280',
          display: 'block',
          marginBottom: '6px',
          transition: 'color 0.2s',
        }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: '100%',
            background: focused ? 'rgba(88,28,135,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : focused ? 'rgba(192,132,252,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '10px',
            padding: isPassword ? '12px 44px 12px 16px' : '12px 16px',
            color: '#f3f4f6',
            fontSize: '0.9rem',
            fontFamily: "'Inter', sans-serif",
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(p => !p)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            {showPass ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              color: '#f87171',
              fontSize: '0.72rem',
              marginTop: '5px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubmitButton = ({ loading, children }) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={!loading ? { scale: 1.015 } : {}}
    whileTap={!loading ? { scale: 0.985 } : {}}
    style={{
      width: '100%',
      padding: '13px',
      borderRadius: '10px',
      border: 'none',
      background: loading
        ? 'rgba(88,28,135,0.4)'
        : 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
      color: '#fff',
      fontFamily: "'Unbounded', sans-serif",
      fontSize: '0.7rem',
      letterSpacing: '0.1em',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}
  >
    {loading && (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    )}
    {loading ? 'Please wait…' : children}
  </motion.button>
);

// ── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = ({ onSuccess, onSwitch }) => {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = key => e => setFields(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateLogin(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed.');
      // --- UPDATED LOGIC ---
      localStorage.setItem('token', data.access_token);
      // This saves the user object so the Admin check can find it
      localStorage.setItem('user', JSON.stringify(data.user)); 
      // ---------------------
      onSuccess(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField label="Email" type="email" value={fields.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" autoComplete="email" />
      <InputField label="Password" type="password" value={fields.password} onChange={set('password')} error={errors.password} placeholder="••••••••" autoComplete="current-password" />

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '16px',
            }}
          >
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <SubmitButton loading={loading}>Sign In</SubmitButton>

      <SocialLogins />

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>
        No account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>
          Create one
        </button>
      </p>
    </form>
  );
};

// ── Signup Form ───────────────────────────────────────────────────────────────
const SignupForm = ({ onSuccess, onSwitch }) => {
  const [fields, setFields] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = key => e => setFields(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validateSignup(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed.');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onSuccess(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField label="Username" value={fields.username} onChange={set('username')} error={errors.username} placeholder="faded_user" autoComplete="username" />
      <InputField label="Email" type="email" value={fields.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" autoComplete="email" />
      <InputField label="Password" type="password" value={fields.password} onChange={set('password')} error={errors.password} placeholder="Min 8 chars, upper, lower, digit, symbol" autoComplete="new-password" />

      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '0.8rem',
              fontFamily: "'Inter', sans-serif",
              marginBottom: '16px',
            }}
          >
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <SubmitButton loading={loading}>Create Account</SubmitButton>

      <SocialLogins />


      <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif" }}>
          Sign in
        </button>
      </p>
    </form>
  );
};

// ── Success State ─────────────────────────────────────────────────────────────
const SuccessState = ({ data, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    style={{ textAlign: 'center', padding: '16px 0' }}
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}
    >
      <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </motion.div>
    <h3 style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '1.1rem', color: '#f3f4f6', marginBottom: '8px' }}>
      Welcome, {data.user.username}
    </h3>
    <p style={{ color: '#6b7280', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif", marginBottom: '24px' }}>
      You're signed in as {data.user.email}
    </p>
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onContinue}
      style={{
        padding: '12px 32px',
        borderRadius: '10px',
        border: 'none',
        background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
        color: '#fff',
        fontFamily: "'Unbounded', sans-serif",
        fontSize: '0.7rem',
        letterSpacing: '0.1em',
        cursor: 'pointer',
      }}
    >
      Continue
    </motion.button>
  </motion.div>
);

// ── Main AuthPage ─────────────────────────────────────────────────────────────
const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userString = params.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        
        // Save to local storage (matches your LoginForm logic)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state to show the "SuccessState" component
        setAuthData({ access_token: token, user: user });

        // Clean the URL so the token doesn't sit in the address bar
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Failed to parse social login user data", err);
      }
    }
  }, []);

  const handleSuccess = data => setAuthData(data);
  const handleContinue = () => {
    // Replace with your router navigation, e.g. navigate('/dashboard')
    window.location.href = '/';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Noise texture */}
      <div
        style={{
          position: 'fixed', inset: 0, opacity: 0.025, pointerEvents: 'none', zIndex: 50,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', backgroundSize: '256px 256px',
        }}
        aria-hidden
      />

      {/* Ambient glows */}
      <div style={{ position: 'absolute', top: '20%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(88,28,135,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} aria-hidden />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} aria-hidden />

      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '36px', position: 'relative', zIndex: 10 }}
      >
        <h1
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Faded Visuals
        </h1>
        <p style={{ color: '#4b5563', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", marginTop: '6px', letterSpacing: '0.05em' }}>
          {mode === 'login' ? 'Welcome back' : 'Join the community'}
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '36px 32px',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Tab switcher — only shown when not authenticated */}
        {!authData && (
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '28px',
            }}
          >
            {['login', 'signup'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '7px',
                  border: 'none',
                  background: mode === m
                    ? 'linear-gradient(135deg, rgba(192,132,252,0.2), rgba(124,58,237,0.2))'
                    : 'transparent',
                  color: mode === m ? '#c084fc' : '#6b7280',
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {authData ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SuccessState data={authData} onContinue={handleContinue} />
            </motion.div>
          ) : mode === 'login' ? (
            <motion.div key="login" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}>
              <LoginForm onSuccess={handleSuccess} onSwitch={() => setMode('signup')} />
            </motion.div>
          ) : (
            <motion.div key="signup" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <SignupForm onSuccess={handleSuccess} onSwitch={() => setMode('login')} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '24px',
          color: '#374151',
          fontSize: '0.72rem',
          fontFamily: "'Inter', sans-serif",
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        Protected by rate limiting · Your data stays yours
      </motion.p>
    </div>
  );
};

export default AuthPage;