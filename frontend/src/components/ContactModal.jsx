import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ContactModal({ isOpen, onClose }) {
  const { addInquiry } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'Custom Design Commission',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addInquiry({
      name: formData.name,
      email: formData.email,
      inquiryType: formData.inquiryType,
      message: formData.message,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #333333',
          maxWidth: 700,
          width: '100%',
          padding: 36,
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close contact modal"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: '#ffffff',
            border: '1.5px solid #000000',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#000000';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#000000';
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <CheckCircle2 size={54} color="#000000" />
            <h3
              style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#000000',
                textTransform: 'uppercase',
              }}
            >
              Message Received
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666666', maxWidth: 400, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
              Thank you for contacting Singhar Concierge. Our bespoke design team will respond to your inquiry within 24 hours.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  fontWeight: 800,
                  color: '#000000',
                  textTransform: 'uppercase',
                }}
              >
                ✦ Singhar Concierge &amp; Bespoke Atelier ✦
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginTop: 6,
                }}
              >
                Contact Our Atelier
              </h2>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#666666',
                  marginTop: 4,
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                }}
              >
                Inquire about custom bespoke jewelry, bridal consultations, or private viewings.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gap: 24,
              }}
              className="contact-inner-grid"
            >
              {/* Info Column */}
              <div
                style={{
                  backgroundColor: '#f8f8f8',
                  padding: 24,
                  borderRadius: 4,
                  border: '1px solid #e5e5e5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#000000', marginBottom: 4 }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-ui)', letterSpacing: '0.06em' }}>ATELIER &amp; STUDIO</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#666666' }}>Lahore · Karachi · Islamabad</p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#000000', marginBottom: 4 }}>
                    <Mail size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-ui)', letterSpacing: '0.06em' }}>DIRECT INQUIRY</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#666666' }}>concierge@singhar.pk</p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#000000', marginBottom: 4 }}>
                    <Phone size={16} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-ui)', letterSpacing: '0.06em' }}>CLIENT DESK</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#666666' }}>+92 300 1234567</p>
                </div>

                <div
                  style={{
                    marginTop: 'auto',
                    borderTop: '1px solid #e5e5e5',
                    paddingTop: 12,
                    fontSize: '0.72rem',
                    color: '#888888',
                  }}
                >
                  Mon – Sat: 10:00 AM – 08:00 PM PKT
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: 2,
                      color: '#000000',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: 2,
                      color: '#000000',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>
                    Inquiry Type
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: 2,
                      color: '#000000',
                      fontSize: '0.85rem',
                      outline: 'none',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    <option>Custom Bespoke Commission</option>
                    <option>Bridal Consultation</option>
                    <option>Order Inquiries</option>
                    <option>Press &amp; Collaborations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'var(--font-ui)' }}>
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #000000',
                      borderRadius: 2,
                      color: '#000000',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '12px 20px',
                    background: '#000000',
                    color: '#ffffff',
                    border: '1.5px solid #000000',
                    borderRadius: 2,
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Send size={15} /> Send Inquiry
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
