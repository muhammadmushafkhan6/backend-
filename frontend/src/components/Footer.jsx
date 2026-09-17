import React, { useState } from 'react';

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor"/>
  </svg>
);
const TiktokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.54a8.16 8.16 0 0 0 4.77 1.52V7.6a4.85 4.85 0 0 1-1-.91z"/>
  </svg>
);

export default function Footer({ onNavigate, onOpenContact, onOpenAdmin }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  const footerLinks = {
    'Collections': [
      { label: 'Necklaces & Chokers', id: 'catalog' },
      { label: 'Earrings & Jhumkas', id: 'catalog' },
      { label: 'Artisan Solitaire Rings', id: 'catalog' },
      { label: 'Heritage Bangles & Kadas', id: 'catalog' },
      { label: 'Bridal Trousseau Sets', id: 'catalog' },
    ],
    'Client Atelier': [
      { label: 'Custom Bespoke Orders', action: onOpenContact },
      { label: 'Bridal Consultation', action: onOpenContact },
      { label: 'Hallmark & Authenticity', action: onOpenContact },
      { label: 'Shipping & Returns Policy', action: onOpenContact },
      { label: 'FAQ & Order Assistance', action: onOpenContact },
    ],
    'Information': [
      { label: 'About Maison Singhar', id: 'home' },
      { label: 'Gemstone Education Guide', action: onOpenContact },
      { label: 'Care & Cleaning Tips', action: onOpenContact },
      { label: 'Payment & Security', action: onOpenContact },
      { label: 'Track Your Order', action: onOpenContact },
    ],
  };

  const socials = [
    { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/singharrofficial' },
    { icon: FacebookIcon, label: 'Facebook', href: '#' },
    { icon: YoutubeIcon, label: 'YouTube', href: '#' },
    { icon: TiktokIcon, label: 'TikTok', href: '#' },
  ];

  return (
    <footer style={{ background: '#000000', color: '#ffffff', borderTop: '1px solid #222222' }}>
      {/* Newsletter Block */}
      <div
        style={{
          background: '#0a0a0a',
          borderBottom: '1px solid #222222',
          padding: '60px 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              alignItems: 'center',
            }}
            className="newsletter-grid"
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  display: 'block',
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                ✦ PRIVATE ATELIER GAZETTE ✦
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Join The Maison Singhar Society
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontSize: '0.98rem',
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                Receive exclusive invitations to heirloom launches, bridal previews &amp; private salon events.
              </p>
            </div>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 0, maxWidth: 450 }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: '14px 20px',
                  background: '#141414',
                  border: '1px solid #333333',
                  borderRight: 'none',
                  borderRadius: '9999px 0 0 9999px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-serif)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 28px',
                  background: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '0 9999px 9999px 0',
                  color: '#000000',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-ui)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e5e5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .newsletter-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          }
        `}</style>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '70px 0 50px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
              gap: 40,
            }}
            className="footer-links-grid"
          >
            {/* Brand Column */}
            <div>
              <img
                src="/logo.png"
                alt="Singhar"
                style={{
                  height: 72,
                  width: 'auto',
                  maxWidth: 200,
                  objectFit: 'contain',
                  display: 'block',
                  marginBottom: 16,
                  filter: 'brightness(1.2)',
                  transform: 'scale(1.25)',
                  transformOrigin: 'left center',
                }}
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'block'; }}
              />
              <span style={{ display: 'none', fontFamily: 'var(--font-brand)', fontSize: '2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em' }}>SINGHAR</span>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  maxWidth: 300,
                  marginBottom: 24,
                  opacity: 0.95,
                }}
              >
                Pakistan's premier royal jewellery atelier — crafting exquisite heirlooms, Polki Kundan pieces &amp; bespoke bridal trousseaux since generations.
              </p>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#141414',
                      border: '1px solid #333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#141414';
                      e.currentTarget.style.borderColor = '#333333';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h4
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    marginBottom: 20,
                    paddingBottom: 10,
                    borderBottom: '1px solid #222222',
                  }}
                >
                  {title}
                </h4>
                <ul style={{ listStyle: 'none' }}>
                  {items.map((link, idx) => (
                    <li key={idx} style={{ marginBottom: 11 }}>
                      <button
                        onClick={link.action ? link.action : () => onNavigate && onNavigate(link.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          fontFamily: 'var(--font-serif)',
                          cursor: 'pointer',
                          padding: 0,
                          textAlign: 'left',
                          transition: 'opacity 0.2s',
                          lineHeight: 1.4,
                          opacity: 0.9,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid #222222',
          padding: '20px 0',
          background: '#000000',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: '#ffffff',
              fontSize: '0.82rem',
              opacity: 0.85,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>© MMXXVI Maison Singhar Haute Joaillerie. All rights reserved.</span>
            {/* Discreet Admin Key for store owner */}
            <button
              onClick={onOpenAdmin}
              title="Staff Authentication"
              aria-label="Staff Authentication"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                padding: '2px 4px',
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.25)')}
            >
              ✦
            </button>
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              color: '#ffffff',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>JazzCash</span>
            <span>EasyPaisa</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>✦ Secure Checkout</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-links-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .footer-links-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
