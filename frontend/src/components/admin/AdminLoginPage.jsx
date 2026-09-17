import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import adminLogo from '../../assets/admin-logo.png';

export default function AdminLoginPage({ onLoginSuccess, onBackToStore }) {
  const { adminLogin } = useStore();
  const [username, setUsername] = useState(() => localStorage.getItem('singhar_admin_remember') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminLogin({
        username: username.trim(),
        password: password.trim(),
      });

      if (res && res.success) {
        if (rememberMe) {
          localStorage.setItem('singhar_admin_remember', username.trim());
        } else {
          localStorage.removeItem('singhar_admin_remember');
        }
        onLoginSuccess();
      } else {
        setError(res?.error || 'Invalid administrator username or password.');
      }
    } catch {
      setError('Authentication server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(35, 35, 35, 0.6) 0%, rgba(10, 10, 10, 0.95) 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-brand)',
        color: '#ffffff',
      }}
    >
      {/* Background Subtle Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top Bar with Return to Store */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <button
          onClick={onBackToStore}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#cccccc',
            padding: '8px 16px',
            borderRadius: 9999,
            fontSize: '0.8rem',
            fontFamily: 'var(--font-brand)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#cccccc';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          }}
        >
          <ArrowLeft size={15} />
          <span>Return to Store</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: 24,
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
          padding: '44px 38px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Brand Logo Emblem */}
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: 20,
            background: '#050505',
            border: '1.5px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            padding: 12,
            transition: 'transform 0.3s ease',
          }}
        >
          <img
            src={adminLogo || '/admin-logo.png'}
            alt="Singhar"
            onError={(e) => {
              if (e.currentTarget.src.includes('admin-logo.png.png')) return;
              e.currentTarget.src = '/admin-logo.png.png';
            }}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.15))',
            }}
          />
        </div>

        {/* Brand Headings */}
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#a3a3a3',
            display: 'block',
            marginBottom: 8,
          }}
        >
          ✦ MAISON SINGHAR ATELIER ✦
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          Admin Portal Login
        </h1>

        <p
          style={{
            fontSize: '0.84rem',
            color: '#888888',
            lineHeight: 1.5,
            marginBottom: 28,
            fontFamily: 'var(--font-brand)',
          }}
        >
          Authorized administrator login to manage products, order fulfillment, and inquiries.
        </p>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textAlign: 'left',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Username / Email Field */}
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#cccccc',
                marginBottom: 6,
              }}
            >
              Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <User size={17} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Username or email"
                autoComplete="username"
                style={{
                  width: '100%',
                  background: '#080808',
                  border: '1.5px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 12,
                  padding: '13px 14px 13px 42px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-brand)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)')}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#cccccc',
                marginBottom: 6,
              }}
            >
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666666',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  background: '#080808',
                  border: '1.5px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: 12,
                  padding: '13px 44px 13px 42px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-brand)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#ffffff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#777777',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.78rem',
              color: '#888888',
              marginTop: 2,
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#ffffff', cursor: 'pointer' }}
              />
              <span>Remember session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 10,
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: 12,
              padding: '14px 24px',
              fontWeight: 800,
              fontSize: '0.86rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.25s ease',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badge */}
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: '0.72rem',
            color: '#666666',
          }}
        >
          <ShieldCheck size={14} color="#888888" />
          <span>256-Bit SSL Encrypted · Maison Singhar Confidential</span>
        </div>
      </motion.div>

      {/* Copyright Line */}
      <div
        style={{
          marginTop: 24,
          fontSize: '0.75rem',
          color: '#555555',
          letterSpacing: '0.04em',
          zIndex: 1,
        }}
      >
        © MMXXVI Maison Singhar Haute Joaillerie. All rights reserved.
      </div>
    </div>
  );
}
