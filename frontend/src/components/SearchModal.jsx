import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function SearchModal({ isOpen, onClose, onSelectProduct }) {
  const { products, formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const popularTags = ['Emerald Choker', 'Polki Kundan', 'Pearl Drops', 'Solitaire Ring', 'Ruby Kada', 'Sapphire Jhumkas'];

  const results =
    searchTerm.trim() === ''
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* Search Header Container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          padding: '30px 24px 36px 24px',
          zIndex: 1201,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="container" style={{ maxWidth: 800 }}>
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#000000',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              ✦ Search Singhar Fine Archive ✦
            </span>
            <button
              onClick={onClose}
              aria-label="Close search"
              style={{
                background: '#ffffff',
                border: '1.5px solid #000000',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Search
              size={22}
              style={{
                position: 'absolute',
                left: 18,
                color: '#000000',
              }}
            />
            <input
              type="text"
              autoFocus
              placeholder="Search by jewel name, polki, ruby, emerald, kada..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 54px',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-serif)',
                borderRadius: 4,
                border: '2px solid #000000',
                backgroundColor: '#fcfcfc',
                color: '#000000',
                outline: 'none',
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: '0.74rem', color: '#666666', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-ui)' }}>
              Curations:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                style={{
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  padding: '4px 12px',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                  e.currentTarget.style.color = '#000000';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Drop */}
      {searchTerm.trim() !== '' && (
        <div
          style={{
            flex: 1,
            backgroundColor: '#fafafa',
            overflowY: 'auto',
            padding: '30px 24px',
            position: 'relative',
            zIndex: 1201,
          }}
        >
          <div className="container" style={{ maxWidth: 800 }}>
            <p style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 600, textTransform: 'uppercase', marginBottom: 16 }}>
              Found {results.length} heirloom matches
            </p>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666666' }}>
                <p>No matching royal jewels found. Try exploring another term.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: 4,
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <img
                      src={product.image || '/assets/Hero1.png'}
                      alt={product.name}
                      style={{
                        width: 54,
                        height: 54,
                        objectFit: 'contain',
                        borderRadius: 4,
                        background: '#f8f8f8',
                        padding: 4,
                      }}
                    />
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '0.85rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase' }}>
                        {product.name}
                      </h4>
                      <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#000000', fontFamily: 'var(--font-ui)' }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
