import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import adminLogo from '../../assets/admin-logo.png';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const { adminLogin } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your administrator PIN or password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const success = await adminLogin(pin);
      if (success) {
        setPin('');
        setError('');
        onSuccess();
      } else {
        setError('Invalid Admin PIN. (Default: admin123)');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: 440,
            width: '100%',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #1a1a1a',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
            padding: '36px 32px',
            position: 'relative',
            textAlign: 'center',
            fontFamily: 'var(--font-brand)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: '#f5f5f5',
              border: '1px solid #e5e5e5',
              borderRadius: '50%',
              width: 34,
              height: 34,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333333',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e5e5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          >
            <X size={16} />
          </button>

          {/* Brand Logo Emblem */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 16,
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              padding: 10,
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
              }}
            />
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#666666',
              display: 'block',
              marginBottom: 6,
            }}
          >
            Maison Singhar Atelier
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#000000',
              marginBottom: 8,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Admin Portal Access
          </h3>

          <p
            style={{
              fontSize: '0.84rem',
              color: '#666666',
              marginBottom: 24,
              lineHeight: 1.5,
              fontFamily: 'var(--font-body)',
            }}
          >
            Restricted area. Please authenticate with your administrator PIN or password to manage products, orders, and inquiries.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter PIN (e.g. admin123)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 18px',
                  borderRadius: 10,
                  border: error ? '1.5px solid #ef4444' : '1.5px solid #111111',
                  fontSize: '0.92rem',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-brand)',
                  background: '#ffffff',
                  color: '#000000',
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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

            {error && (
              <span
                style={{
                  display: 'block',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginTop: -4,
                }}
              >
                {error}
              </span>
            )}

            <button
              type="submit"
              disabled={loading}
              className="pill-btn"
              style={{
                width: '100%',
                padding: '14px',
                justifyContent: 'center',
                fontSize: '0.85rem',
                letterSpacing: '0.14em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: '0.75rem',
              color: '#888888',
            }}
          >
            <ShieldCheck size={14} color="#111111" />
            <span>
              Authorized Personnel Only · Default PIN: <strong style={{ color: '#000000' }}>admin123</strong>
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
