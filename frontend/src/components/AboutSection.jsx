import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Gem, Banknote, MessageCircle } from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: <Truck size={22} strokeWidth={1.6} color="#ffffff" />,
    title: 'Free Worldwide Delivery',
    subtitle: 'On orders over Rs. 3,000',
  },
  {
    icon: <Gem size={22} strokeWidth={1.6} color="#ffffff" />,
    title: '100% Handcrafted',
    subtitle: 'Authentic Pakistani heirloom jewellery',
  },
  {
    icon: <Banknote size={22} strokeWidth={1.6} color="#ffffff" />,
    title: 'Cash on Delivery',
    subtitle: 'Nationwide & international options',
  },
  {
    icon: <MessageCircle size={22} strokeWidth={1.6} color="#ffffff" />,
    title: '24/7 WhatsApp Support',
    subtitle: 'Dedicated personal stylist concierge',
  },
];

export default function AboutSection({ onContactClick }) {
  return (
    <>
      {/* Trust Badges Row — Pure Jet Black Luxury */}
      <section
        style={{
          background: '#000000',
          borderTop: '1px solid #222222',
          borderBottom: '1px solid #222222',
          padding: '0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }} />

        <div className="container" style={{ padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
            className="trust-grid"
          >
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 6,
                  padding: '26px 20px',
                  borderRight: i < TRUST_BADGES.length - 1 ? '1px solid #222222' : 'none',
                  position: 'relative',
                }}
                className="trust-badge-item"
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#141414',
                    border: '1px solid #333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                    fontSize: '1.3rem',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {badge.icon}
                </div>
                {/* Title */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1.3,
                  }}
                >
                  {badge.title}
                </div>
                {/* Subtitle */}
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.74rem',
                    fontStyle: 'italic',
                    color: '#888888',
                    lineHeight: 1.4,
                  }}
                >
                  {badge.subtitle}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }} />

        <style>{`
          @media (max-width: 900px) {
            .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .trust-badge-item { border-right: none !important; border-bottom: 1px solid #222222 !important; }
          }
          @media (max-width: 560px) {
            .trust-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* About Section (Singhar Brand Story) */}
      <section
        id="about-section"
        style={{
          background: '#ffffff',
          padding: '95px 0 105px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              gap: 60,
              alignItems: 'center',
            }}
            className="about-zaiwar-grid"
          >
            {/* Left: Jewel Frame Image */}
            <div style={{ position: 'relative', minHeight: 460 }}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
                style={{
                  borderRadius: '110px 110px 24px 24px',
                  overflow: 'hidden',
                  border: '2px solid #000000',
                  boxShadow: '0 24px 55px rgba(0,0,0,0.12)',
                  background: '#f7f7f7',
                  height: 450,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                }}
              >
                <img
                  src="/assets/Hero1.png"
                  alt="Singhar Heritage Jewellery"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '90px 90px 18px 18px' }}
                />
              </motion.div>

              {/* Floating Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 24,
                  right: -10,
                  background: '#000000',
                  color: '#ffffff',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: '1px solid #333333',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
              >
                ✦ وراثت · محبت · ہنر ✦
              </div>
            </div>

            {/* Right: The Brand Story */}
            <div>
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 800,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#000000',
                    marginBottom: 6,
                  }}
                >
                  ✦ THE ATELIER STORY ✦
                </span>
              </div>

              {/* Title: SINGHAR */}
              <h2
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                  fontWeight: 900,
                  color: '#000000',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: 1.05,
                  marginBottom: 16,
                }}
              >
                SINGHAR
              </h2>

              {/* Urdu / English Subhead */}
              <div
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  color: '#000000',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  marginBottom: 20,
                  borderLeft: '3px solid #000000',
                  paddingLeft: 16,
                }}
              >
                A jewelry brand born from وراثت and محبت, ہنر
              </div>

              {/* Paragraphs */}
              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  color: '#333333',
                  fontFamily: 'var(--font-serif)',
                  marginBottom: 16,
                }}
              >
                It's a feeling, a kahani, a celebration of our roots. Each piece is a fusion of tradition and modern elegance, meticulously handcrafted to reflect the grace of desi-core aesthetics and effortless modernity.
              </p>

              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  color: '#444444',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  marginBottom: 28,
                }}
              >
                Each piece is handcrafted as a story: intimate, elegant and personal.
              </p>

              {/* Feature Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
                {['وراثت', 'محبت', 'ہنر', 'Desi-Core Elegance', 'Handcrafted Kahani'].map((feat) => (
                  <span
                    key={feat}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #000000',
                      color: '#000000',
                      padding: '5px 14px',
                      borderRadius: 9999,
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}
                  >
                    ✦ {feat}
                  </span>
                ))}
              </div>

              <button
                onClick={onContactClick}
                style={{
                  background: '#000000',
                  color: '#ffffff',
                  padding: '12px 30px',
                  border: '1.5px solid #000000',
                  borderRadius: 9999,
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
                }}
              >
                Explore The Kahani <span>→</span>
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .about-zaiwar-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </section>
    </>
  );
}
