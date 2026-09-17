import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Categories({ onSelectCategory }) {
  return (
    <section
      id="collections-section"
      style={{
        background: '#ffffff',
        padding: '80px 0 95px',
        position: 'relative',
        borderBottom: '1px solid var(--border-light)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: 44, textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#601d1d',
              display: 'block',
              marginBottom: 6,
            }}
          >
            ✦ DISCOVER THE VAULT ✦
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              fontWeight: 900,
              color: 'var(--dark)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Shop By Category
          </h2>
          <div
            style={{
              width: 50,
              height: 2,
              background: '#601d1d',
              margin: '12px auto 0',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Circular / Rounded Category Bubble Carousel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}
          className="categories-zaiwar-grid"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                background: '#faf7f2',
                borderRadius: 20,
                border: '1.5px solid var(--border-light)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '24px 20px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(96, 29, 29, 0.15)';
                e.currentTarget.style.borderColor = '#601d1d';
                e.currentTarget.style.background = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.background = '#faf7f2';
              }}
            >
              {/* Circular Photo Frame */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '2px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 14,
                  marginBottom: 16,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>

              {/* Title & Item Subtitle */}
              <h3
                style={{
                  fontFamily: 'var(--font-brand)',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: 'var(--dark)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {cat.title}
              </h3>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  lineHeight: 1.35,
                  marginBottom: 12,
                }}
              >
                {cat.subtitle}
              </p>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#601d1d',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Explore Category <ArrowUpRight size={13} />
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .categories-zaiwar-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 580px) {
          .categories-zaiwar-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
