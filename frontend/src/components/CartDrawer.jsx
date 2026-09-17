import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const { formatPrice, settings } = useStore();
  const subtotal = cartItems.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const threshold = 3000;
  const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
  const needed = Math.max(0, threshold - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 420,
              background: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1,
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: '#000000', letterSpacing: '0.04em' }}>
                  Shopping Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666666',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Delivery Meter */}
            <div style={{ padding: '12px 24px', background: '#f8f8f8', borderBottom: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Truck size={14} color="#000000" />
                <span style={{ fontSize: '0.74rem', color: '#111111', fontWeight: 700 }}>
                  {needed === 0 ? (
                    <span style={{ color: '#16a34a' }}>🎉 You unlocked Free Express Delivery!</span>
                  ) : (
                    <span>Add <strong>{formatPrice(needed)}</strong> more for <strong>FREE Delivery</strong></span>
                  )}
                </span>
              </div>
              <div style={{ width: '100%', height: 4, background: '#e5e5e5', borderRadius: 9999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: needed === 0 ? '#16a34a' : '#000000',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888888' }}>
                  <p style={{ fontSize: '0.95rem', marginBottom: 12 }}>Your shopping bag is empty.</p>
                  <p style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>Explore our heirloom jewels and add your favorites.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        display: 'flex',
                        gap: 14,
                        paddingBottom: 16,
                        marginBottom: 16,
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <img
                        src={item.image || '/assets/Hero1.png'}
                        alt={item.name}
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: 6,
                          objectFit: 'contain',
                          background: '#fcfcfc',
                          border: '1px solid #e5e5e5',
                          padding: 4,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#111111', lineHeight: 1.2 }}>
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id, item.selectedSize)}
                            style={{ background: 'none', border: 'none', color: '#999999', cursor: 'pointer', padding: 2 }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        {item.selectedSize && (
                          <span style={{ fontSize: '0.72rem', color: '#666666' }}>Size: {item.selectedSize}</span>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #000000', borderRadius: 2, background: '#ffffff' }}>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', color: '#000000', padding: '3px 8px', cursor: 'pointer', fontWeight: 800 }}
                            >
                              <Minus size={11} />
                            </button>
                            <span style={{ padding: '0 8px', fontSize: '0.78rem', fontWeight: 800, color: '#000000' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', color: '#000000', padding: '3px 8px', cursor: 'pointer', fontWeight: 800 }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 900, color: '#000000' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: '20px 24px',
                  borderTop: '1px solid #e5e5e5',
                  background: '#f8f8f8',
                }}
              >
                {/* Active Promo Notice */}
                {settings?.offer?.enabled && (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px dashed #111111',
                      borderRadius: 8,
                      padding: '8px 12px',
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#000000', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        🎁 ACTIVE OFFER
                      </span>
                      <p style={{ fontSize: '0.72rem', color: '#555555', margin: 0 }}>
                        Use code <strong style={{ color: '#000000' }}>{settings.offer.code}</strong> at checkout for {settings.offer.discountType === 'percent' ? `${settings.offer.discountValue}% OFF` : `Rs. ${settings.offer.discountValue} OFF`}!
                      </p>
                    </div>
                    <span
                      style={{
                        background: '#000000',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 4,
                        letterSpacing: '0.06em',
                      }}
                    >
                      {settings.offer.code}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <span style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Subtotal
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 900, color: '#000000' }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button
                  className="pill-btn"
                  onClick={onCheckout}
                  style={{ width: '100%', padding: '14px', fontSize: '0.82rem', justifyContent: 'center', background: '#000000', color: '#ffffff', border: '1.5px solid #000000' }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: '0.72rem', color: '#666666' }}>
                  <ShieldCheck size={14} color="#000000" />
                  <span>Secure Encrypted Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
