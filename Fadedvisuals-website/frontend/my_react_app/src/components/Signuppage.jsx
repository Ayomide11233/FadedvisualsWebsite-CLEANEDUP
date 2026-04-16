import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc'; 
import { FaApple } from 'react-icons/fa';
import { API_ROUTES } from '../config/api';

const Signuppage = ({ onSignUpSuccess, onToggleMode = () => console.log("Toggle missing!") }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

   // --- Social Login Handlers ---
   const handleGoogleSignup = () => {
    // Typically redirects to your FastAPI backend endpoint
    window.location.href = `${API_ROUTES.BASE_URL}/auth/google/login`;
  };

  const handleAppleSignup = () => {
    window.location.href = `${API_ROUTES.BASE_URL}/auth/apple/login`;
  };
  // -----------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }

    // Updated to 8 to match your backend requirement
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    // Prevent default form submission behavior (stops the "blank page" refresh)
    if (e) e.preventDefault();
    
    if (!validateForm()) return;
  
    setLoading(true);
    setError('');

    try {
      const response = await fetch(API_ROUTES.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('token', data.access_token); 
        setSuccess('Account created successfully!');
        onSignUpSuccess(); 
      } else {
        /**
         * BACKEND ERROR LOGIC:
         * FastAPI/Pydantic errors usually come back as an array in 'detail'.
         * We check for that specific "msg" field you mentioned.
         */
        if (data.detail && Array.isArray(data.detail)) {
          setError(data.detail[0].msg);
        } else if (typeof data.detail === 'string') {
          setError(data.detail);
        } else {
          setError('Signup failed. Please check your details.');
        }
      }
    } catch (err) {
      setError('Cannot connect to backend. Is uvicorn running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex h-screen w-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Error Notification */}
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}
        
        {/* Success Notification */}
        {success && (
          <div className="mb-4 rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-400 border border-green-500/20">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-100">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 pr-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-100">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign up'}
            </button>
          </div>
        </form>

        {/* --- OR Divider --- */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* --- Social Buttons --- */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FcGoogle size={20} />
              <span className="text-sm font-semibold leading-6">Google</span>
            </button>

            <button
              onClick={handleAppleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
            >
              <FaApple size={20} />
              <span className="text-sm font-semibold leading-6">Apple</span>
            </button>
          </div>
        </div>

        {/* Toggle to Login */}
        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onToggleMode) onToggleMode();
            }}
            className="font-semibold text-indigo-400 hover:text-indigo-300 bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signuppage;