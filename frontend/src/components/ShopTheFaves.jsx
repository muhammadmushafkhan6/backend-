import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Monochrome Geometric Ornament SVG
const MonochromeOrnament = () => (
  <svg width="180" height="18" viewBox="0 0 180 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="9" x2="72" y2="9" stroke="#000000" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
    <polygon points="80,9 85,4 90,9 85,14" fill="#000000" opacity="0.6" />
    <polygon points="88,9 90,6 92,9 90,12" fill="#000000" />
    <polygon points="90,9 95,4 100,9 95,14" fill="#000000" opacity="0.6" />
    <line x1="108" y1="9" x2="180" y2="9" stroke="#000000" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
  </svg>
);

export default function ShopTheFaves({ onAddToCart, onQuickView }) {
  const { products, formatPrice } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const tabs = [
    { id: 'all', label: '✦ All Vault ✦' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'bridal', label: 'Bridal Archive' },
  ];

  const allProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  let filtered = allProducts;
  if (activeTab === 'bestsellers') {
    filtered = allProducts.filter((p) => p.badge?.toLowerCase().includes('bestseller') || p.price > 300);
  } else if (activeTab === 'new-arrivals') {
    filtered = allProducts.filter((p) => p.tab === 'new-arrivals' || !p.badge);
  } else if (activeTab === 'bridal') {
    filtered = allProducts.filter((p) => p.category === 'necklaces' || p.badge?.toLowerCase().includes('bridal'));
  }

  if (filtered.length === 0 && allProducts.length > 0) {
    filtered = allProducts;
  }

  return (
    <section
      id="shop-faves"
      style={{
        background: '#fafafa',
        padding: '90px 0 110px',
        position: 'relative',
        borderBottom: '1px solid #e5e5e5',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Texture Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Border Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-ui)',
              fontWeight: 800,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#000000',
              display: 'block',
              marginBottom: 10,
            }}
          >
            ✦ MAISON SINGHAR CURATIONS ✦
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900,
              color: '#000000',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Featured Heirlooms
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
            <MonochromeOrnament />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#555555',
              marginTop: 10,
              letterSpacing: '0.02em',
            }}
          >
            Each piece — a whisper of وراثت, a promise of ہنر
          </p>
        </div>

        {/* Navigation Filter Tabs — Black & White Haute Couture */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 50,
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? '#000000' : '#ffffff',
                  border: isActive ? '1.5px solid #000000' : '1px solid #d1d1d1',
                  color: isActive ? '#ffffff' : '#000000',
                  padding: '9px 24px',
                  borderRadius: 9999,
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: isActive ? 800 : 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.background = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#d1d1d1';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid #e5e5e5',
            }}
          >
            <Sparkles size={32} color="#000000" style={{ margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Vault Curations in Progress
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#666666', fontFamily: 'var(--font-brand)', marginTop: 6 }}>
              Our royal fine jewellery heirlooms are currently being handcrafted in the atelier.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 22,
            }}
            className="zaiwar-product-grid"
          >
            {filtered.map((product, idx) => {
              if (!product) return null;
              const hasSecondImage = product.hoverImage && product.hoverImage !== product.image;
              const isHovered = hoveredProduct === product.id;

              return (
                <motion.div
                  key={product.id || idx}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  style={{
                    background: '#ffffff',
                    borderRadius: 4,
                    border: isHovered ? '1px solid #000000' : '1px solid #e5e5e5',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isHovered
                      ? '0 16px 36px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0,0,0,0.06)'
                      : '0 2px 10px rgba(0,0,0,0.04)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                >
                  {/* Corner Filigree Ornaments on Hover */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      width: 20,
                      height: 20,
                      borderTop: '1.5px solid #000000',
                      borderLeft: '1.5px solid #000000',
                      borderRadius: '2px 0 0 0',
                      zIndex: 2,
                      pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 20,
                      height: 20,
                      borderTop: '1.5px solid #000000',
                      borderRight: '1.5px solid #000000',
                      borderRadius: '0 2px 0 0',
                      zIndex: 2,
                      pointerEvents: 'none',
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />



                  {/* Image Stage */}
                  <div
                    style={{
                      height: 270,
                      background: '#fcfcfc',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 24,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      overflow: 'hidden',
                    }}
                    onClick={() => onQuickView(product)}
                  >
                    <motion.img
                      animate={{ scale: isHovered ? 1.06 : 1 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      src={isHovered && hasSecondImage ? product.hoverImage : product.image}
                      alt={product.name}
                      style={{
                        maxWidth: '88%',
                        maxHeight: '88%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.08))',
                        position: 'relative',
                        zIndex: 2,
                        transition: 'filter 0.35s ease',
                      }}
                    />

                    {/* Quick View Eye Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      title="Quick View"
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: '#000000',
                        border: '1px solid #000000',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                        transition: 'all 0.25s ease',
                        zIndex: 4,
                      }}
                    >
                      <Eye size={15} />
                    </button>
                  </div>

                  {/* Product Details Footer */}
                  <div
                    style={{
                      padding: '16px 16px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                      justifyContent: 'space-between',
                      background: '#ffffff',
                    }}
                  >
                    <div>
                      {/* Category / Color Label — small gray uppercase (like reference) */}
                      {product.colors && (
                        <p
                          style={{
                            fontSize: '0.68rem',
                            color: '#999999',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: 400,
                            letterSpacing: '0.12em',
                            marginBottom: 4,
                            textTransform: 'uppercase',
                          }}
                        >
                          {Array.isArray(product.colors) ? product.colors.join(' · ') : product.colors}
                        </p>
                      )}

                      {/* Product Name — elegant serif, normal case, underline on hover */}
                      <h3
                        onClick={() => onQuickView(product)}
                        className="product-card-name"
                        style={{
                          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                          fontSize: '1.05rem',
                          fontWeight: 500,
                          color: '#111111',
                          letterSpacing: '0.01em',
                          textTransform: 'none',
                          marginBottom: 8,
                          cursor: 'pointer',
                          lineHeight: 1.4,
                          textDecoration: isHovered ? 'underline' : 'none',
                          textUnderlineOffset: '3px',
                          transition: 'text-decoration 0.2s ease',
                        }}
                      >
                        {product.name}
                      </h3>

                      {/* Price — light weight, clean */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-ui)',
                            fontSize: '0.92rem',
                            fontWeight: 400,
                            color: '#111111',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span
                            style={{
                              fontFamily: 'var(--font-ui)',
                              fontSize: '0.82rem',
                              color: '#bbbbbb',
                              textDecoration: 'line-through',
                              fontWeight: 400,
                            }}
                          >
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => onQuickView(product)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 2,
                        background: isHovered ? '#000000' : '#ffffff',
                        color: isHovered ? '#ffffff' : '#000000',
                        border: '1.5px solid #000000',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <Eye size={13} />
                      Explore Piece
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .zaiwar-product-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .zaiwar-product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
        }
        @media (max-width: 480px) {
          .zaiwar-product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
