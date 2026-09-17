import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, ShoppingBag, Eye } from 'lucide-react';

export default function CatalogView({
  initialCategory = 'all',
  onBackToHome,
  onAddToCart,
  onQuickView,
}) {
  const { products, formatPrice } = useStore();
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');

  const categoriesList = [
    { id: 'all', label: 'All Heirlooms' },
    { id: 'necklaces', label: 'Royale Necklaces' },
    { id: 'earrings', label: 'Vintage Earrings' },
    { id: 'rings', label: 'Artisan Rings' },
    { id: 'bangles', label: 'Heritage Bangles' },
  ];

  let filtered =
    selectedCat === 'all'
      ? products
      : products.filter((p) => p.category === selectedCat);

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div
      style={{
        padding: '30px 0 90px 0',
        backgroundColor: '#fafafa',
        minHeight: '85vh',
      }}
    >
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={onBackToHome}
            style={{
              background: 'none',
              border: 'none',
              color: '#000000',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>

        {/* Page Heading */}
        <div style={{ marginBottom: 36, textAlign: 'left' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-ui)',
              fontWeight: 800,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#000000',
              display: 'block',
              marginBottom: 8,
            }}
          >
            ✦ THE MAISON SINGHAR ARCHIVE ✦
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              color: '#000000',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 8,
            }}
          >
            All Handcrafted Collections
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#666666',
            }}
          >
            Exquisite Pakistani royal heirloom jewelry, Polki Kundan pieces &amp; bridal trousseaux.
          </p>
        </div>

        {/* Filter / Controls Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            backgroundColor: '#ffffff',
            padding: '14px 20px',
            borderRadius: 8,
            border: '1px solid #e5e5e5',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            marginBottom: 36,
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categoriesList.map((cat) => {
              const active = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{
                    backgroundColor: active ? '#000000' : '#ffffff',
                    border: active ? '1.5px solid #000000' : '1px solid #d1d1d1',
                    color: active ? '#ffffff' : '#000000',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: active ? 800 : 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: 9999,
                    padding: '7px 18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '0.82rem', color: '#666666', fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
              {filtered.length} products
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #000000',
                color: '#000000',
                fontSize: '0.78rem',
                padding: '7px 14px',
                borderRadius: 4,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '70px 20px',
              background: '#ffffff',
              borderRadius: 8,
              border: '1px solid #e5e5e5',
            }}
          >
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 12 }}>✦</span>
            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', fontWeight: 700, color: '#000000', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Vault Curations in Progress
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#666666', maxWidth: 440, margin: '0 auto 20px', fontFamily: 'var(--font-brand)' }}>
              Our royal fine jewellery heirlooms are currently being handcrafted in the atelier.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="catalog-grid"
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 4,
                  border: '1px solid #e5e5e5',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#000000';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e5e5';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.04)';
                }}
              >
                {/* Product Image Stage */}
                <div
                  style={{
                    height: 260,
                    position: 'relative',
                    background: '#fcfcfc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                  onClick={() => onQuickView(product)}
                >


                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.3 }}
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08))',
                    }}
                  />
                </div>

                {/* Product Info */}
                <div
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-brand)',
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: '#000000',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {product.name}
                      </h3>
                      <span
                        style={{
                          fontFamily: 'var(--font-ui)',
                          fontSize: '1.05rem',
                          fontWeight: 900,
                          color: '#000000',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: '#666666',
                        lineHeight: 1.5,
                        marginBottom: 16,
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                      }}
                    >
                      {product.description?.substring(0, 80)}...
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => onQuickView(product)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1.5px solid #000000',
                        color: '#000000',
                        borderRadius: 2,
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
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
                      <Eye size={14} />
                      View Details
                    </button>

                    <button
                      onClick={() => onAddToCart(product)}
                      style={{
                        padding: '10px 18px',
                        background: '#000000',
                        border: '1.5px solid #000000',
                        color: '#ffffff',
                        borderRadius: 2,
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#262626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#000000';
                      }}
                    >
                      <ShoppingBag size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .catalog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .catalog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
