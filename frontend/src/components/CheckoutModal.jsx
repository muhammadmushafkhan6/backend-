import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, MapPin, Phone, User, Home, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CheckoutModal({ isOpen, onClose, cartItems = [], onOrderPlaced }) {
  const { formatPrice, addOrder, settings } = useStore();

  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Promo Code / Offer State
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const subtotal = cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const delivery = subtotal >= 3000 ? 0 : 200;

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percent') {
      discountAmount = Math.round((subtotal * Number(appliedPromo.discountValue || 0)) / 100);
    } else {
      discountAmount = Math.min(Number(appliedPromo.discountValue || 0), subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountAmount) + delivery;

  const handleApplyPromo = (e) => {
    e?.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a coupon code.');
      return;
    }
    const offer = settings?.offer;
    if (!offer || !offer.enabled) {
      setPromoError('No active promotion found for this code.');
      return;
    }
    if ((offer.code || '').trim().toUpperCase() !== code) {
      setPromoError(`Coupon code "${code}" is invalid.`);
      return;
    }
    if (Number(offer.minOrderAmount) > 0 && subtotal < Number(offer.minOrderAmount)) {
      setPromoError(`This offer requires a minimum order of ${formatPrice(offer.minOrderAmount)}.`);
      return;
    }

    setAppliedPromo({
      code,
      discountType: offer.discountType || 'percent',
      discountValue: offer.discountValue,
      label: offer.discountType === 'percent' ? `${offer.discountValue}% OFF` : `Rs. ${offer.discountValue} OFF`,
    });
    setPromoInput('');
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    try {
      const newOrder = await addOrder({
        customerName: form.name.trim(),
        customerEmail: `${form.phone.trim()}@cod.order`,
        customerPhone: form.phone.trim(),
        customerCity: form.city.trim(),
        customerAddress: form.address.trim(),
        notes: form.notes.trim(),
        total,
        discount: discountAmount,
        promoCode: appliedPromo?.code || '',
        items: [...cartItems],
      });
      setOrderSuccess(newOrder);
      setIsSubmitting(false);
      setTimeout(() => {
        onOrderPlaced();
        onClose();
        setOrderSuccess(null);
        setForm({ name: '', phone: '', city: '', address: '', notes: '' });
        setErrors({});
        setAppliedPromo(null);
      }, 2800);
    } catch {
      setIsSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px',
    border: errors[field] ? '1.5px solid #dc2626' : '1px solid #d1d1d1',
    borderRadius: 4, fontSize: '0.88rem', fontFamily: 'var(--font-ui)',
    color: '#111111', background: '#ffffff', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  });

  const label = {
    display: 'block', fontSize: '0.67rem', fontFamily: 'var(--font-ui)',
    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: '#555555', marginBottom: 6,
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1300,
          background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#ffffff', borderRadius: 8, width: '100%', maxWidth: 800,
            maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)', position: 'relative',
          }}
        >
          {/* Success overlay */}
          <AnimatePresence>
            {orderSuccess && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0, background: '#ffffff', zIndex: 20,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', textAlign: 'center', padding: 40,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: 80, height: 80, borderRadius: '50%', background: '#000000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                  }}
                >
                  <Check size={36} color="#ffffff" strokeWidth={2.5} />
                </motion.div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 500, color: '#111111', marginBottom: 10 }}>
                  Order Placed!
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#666666', lineHeight: 1.75, maxWidth: 340 }}>
                  Thank you, <strong>{form.name}</strong>. Your order{' '}
                  <strong>#{orderSuccess?.id || '—'}</strong> has been received.<br />
                  We'll call you on <strong>{form.phone}</strong> to confirm.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div style={{ background: '#000000', color: '#ffffff', padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 500, color: '#ffffff' }}>
                Complete Your Order
              </h2>
              <p style={{ fontSize: '0.67rem', color: '#aaaaaa', marginTop: 2, fontFamily: 'var(--font-ui)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Maison Singhar · Cash on Delivery
              </p>
            </div>
            <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#ffffff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={17} />
            </button>
          </div>

          {/* Body — 2 cols */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflowY: 'auto', minHeight: 0 }} className="checkout-grid">

            {/* LEFT: Form */}
            <form onSubmit={handleSubmit} style={{ padding: 28, borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: '0.67rem', color: '#888888', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Delivery Information</p>

              {/* Name */}
              <div>
                <label style={label}><User size={11} style={{ display: 'inline', marginRight: 5 }} />Full Name</label>
                <input type="text" placeholder="e.g. Ayesha Khan" value={form.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle('name')}
                  onFocus={(e) => (e.target.style.borderColor = '#000000')}
                  onBlur={(e) => (e.target.style.borderColor = errors.name ? '#dc2626' : '#d1d1d1')} />
                {errors.name && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4 }}>{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={label}><Phone size={11} style={{ display: 'inline', marginRight: 5 }} />Phone Number</label>
                <input type="tel" placeholder="e.g. 0300-1234567" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} style={inputStyle('phone')}
                  onFocus={(e) => (e.target.style.borderColor = '#000000')}
                  onBlur={(e) => (e.target.style.borderColor = errors.phone ? '#dc2626' : '#d1d1d1')} />
                {errors.phone && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4 }}>{errors.phone}</p>}
              </div>

              {/* City */}
              <div>
                <label style={label}><MapPin size={11} style={{ display: 'inline', marginRight: 5 }} />City</label>
                <input type="text" placeholder="e.g. Lahore, Karachi, Islamabad" value={form.city} onChange={(e) => handleChange('city', e.target.value)} style={inputStyle('city')}
                  onFocus={(e) => (e.target.style.borderColor = '#000000')}
                  onBlur={(e) => (e.target.style.borderColor = errors.city ? '#dc2626' : '#d1d1d1')} />
                {errors.city && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4 }}>{errors.city}</p>}
              </div>

              {/* Address */}
              <div>
                <label style={label}><Home size={11} style={{ display: 'inline', marginRight: 5 }} />Full Address</label>
                <textarea rows={3} placeholder="House No., Street, Area..." value={form.address} onChange={(e) => handleChange('address', e.target.value)}
                  style={{ ...inputStyle('address'), resize: 'none', lineHeight: 1.5 }}
                  onFocus={(e) => (e.target.style.borderColor = '#000000')}
                  onBlur={(e) => (e.target.style.borderColor = errors.address ? '#dc2626' : '#d1d1d1')} />
                {errors.address && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4 }}>{errors.address}</p>}
              </div>

              {/* Notes */}
              <div>
                <label style={label}>Order Notes (Optional)</label>
                <textarea rows={2} placeholder="Any special instructions..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)}
                  style={{ ...inputStyle('notes'), resize: 'none', lineHeight: 1.5 }}
                  onFocus={(e) => (e.target.style.borderColor = '#000000')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d1d1')} />
              </div>

              {/* Submit */}
              <button type="submit" disabled={isSubmitting}
                style={{
                  width: '100%', padding: '13px 20px',
                  background: isSubmitting ? '#555555' : '#000000',
                  color: '#ffffff', border: 'none', borderRadius: 4,
                  fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, marginTop: 4, transition: 'background 0.2s',
                }}
              >
                {isSubmitting ? 'Processing...' : (
                  <><ShoppingBag size={16} />Place Order · {formatPrice(total)}<ChevronRight size={15} /></>
                )}
              </button>

              <p style={{ fontSize: '0.68rem', color: '#999999', textAlign: 'center', fontFamily: 'var(--font-ui)' }}>
                🔒 Cash on Delivery · No advance payment required
              </p>
            </form>

            {/* RIGHT: Order Summary */}
            <div style={{ padding: 28, background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: '0.67rem', color: '#888888', fontFamily: 'var(--font-ui)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Order Summary ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <img src={item.image || '/assets/Hero1.png'} alt={item.name}
                      style={{ width: 54, height: 54, objectFit: 'contain', borderRadius: 4, background: '#ffffff', border: '1px solid #e5e5e5', padding: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 500, color: '#111111', lineHeight: 1.3, marginBottom: 2 }}>
                        {item.name}
                      </p>
                      {item.selectedSize && <p style={{ fontSize: '0.68rem', color: '#999999', fontFamily: 'var(--font-ui)' }}>{item.selectedSize}</p>}
                      <p style={{ fontSize: '0.75rem', color: '#555555', fontFamily: 'var(--font-ui)', marginTop: 3 }}>
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111111', fontFamily: 'var(--font-ui)', flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div style={{ background: '#ffffff', borderRadius: 8, padding: 12, border: '1px solid #e5e5e5' }}>
                {!appliedPromo ? (
                  <div>
                    {settings?.offer?.enabled && (
                      <div
                        onClick={() => setPromoInput(settings.offer.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.68rem',
                          color: '#000000',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginBottom: 8,
                          background: '#f5f5f5',
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}
                      >
                        <span>✦</span>
                        <span>Use code <u>{settings.offer.code}</u> for {settings.offer.discountType === 'percent' ? `${settings.offer.discountValue}% OFF` : `Rs. ${settings.offer.discountValue} OFF`}</span>
                      </div>
                    )}
                    <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          if (promoError) setPromoError('');
                        }}
                        placeholder="Discount code / Offer"
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: 4,
                          border: '1px solid #d1d1d1',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: '#000000',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 4,
                          padding: '0 12px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </form>
                    {promoError && (
                      <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4, fontFamily: 'var(--font-ui)' }}>
                        {promoError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ display: 'inline-block', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>
                        ✓ {appliedPromo.code} ({appliedPromo.label})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: '#e5e5e5' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subtotal</span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ui)', fontWeight: 500, color: '#111111' }}>{formatPrice(subtotal)}</span>
              </div>

              {appliedPromo && discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#047857', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Discount ({appliedPromo.code})
                  </span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ui)', fontWeight: 700, color: '#047857' }}>
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#888888', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delivery</span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-ui)', fontWeight: 500, color: delivery === 0 ? '#16a34a' : '#111111' }}>
                  {delivery === 0 ? 'FREE ✓' : formatPrice(delivery)}
                </span>
              </div>

              <div style={{ height: 1, background: '#e5e5e5' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.72rem', color: '#111111', fontFamily: 'var(--font-ui)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', fontWeight: 500, color: '#111111' }}>
                  {formatPrice(total)}
                </span>
              </div>

              <div style={{ background: '#f0f0f0', borderRadius: 4, padding: '12px 14px', display: 'flex', gap: 10 }}>
                <span style={{ fontSize: '1rem' }}>💳</span>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111111', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cash on Delivery</p>
                  <p style={{ fontSize: '0.68rem', color: '#666666', fontFamily: 'var(--font-ui)', marginTop: 3, lineHeight: 1.5 }}>
                    Pay when your order arrives. Our team will call to confirm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <style>{`
          @media (max-width: 640px) {
            .checkout-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </AnimatePresence>
  );
}
