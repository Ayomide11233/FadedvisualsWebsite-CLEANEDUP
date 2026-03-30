import React, { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import InputField from './InputField';
import SendButton from './SendButton';

const SERVICE_ID  = 'service_yiprldl';
const TEMPLATE_ID = 'template_zt1ue19';
const PUBLIC_KEY  = 'k5p_pKpnj6Q8pNFxk';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    request: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:  formData.fullName,
          from_email: formData.email,
          message:    formData.request,
          reply_to:   formData.email,
        },
        PUBLIC_KEY
      );

      setLoading(false);
      setSubmitted(true);

      setTimeout(() => {
        setFormData({ fullName: '', email: '', request: '' });
        setSubmitted(false);
      }, 3000);

    } catch (err) {
      console.error('EmailJS error:', err);
      setLoading(false);
      setError(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Title */}
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold tracking-tight mb-8"
        style={{ fontFamily: "'Unbounded', sans-serif" }}
      >
        <span style={{
          background: 'linear-gradient(135deg, #c084fc, #9333ea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Contact Us
        </span>
      </motion.h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div variants={itemVariants}>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InputField
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InputField
            label="Request"
            placeholder="Tell us about your project or inquiry..."
            value={formData.request}
            onChange={handleChange('request')}
            multiline
            rows={6}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SendButton loading={loading} disabled={submitted}>
            {submitted ? '✓ SENT!' : 'SEND'}
          </SendButton>
        </motion.div>

        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-green-400 text-sm mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Thank you! We'll get back to you soon.
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-400 text-sm mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Something went wrong. Please try again.
          </motion.p>
        )}
      </form>
    </motion.div>
  );
};

export default ContactForm;