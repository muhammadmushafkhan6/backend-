import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check, ShoppingBag, ShieldCheck, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) {
  const { formatPrice } = useStore();
  if (!isOpen || !product) return null;

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image ? [product.image] : ['/assets/Hero1.png']);

  const validSizes = React.useMemo(() => {
    if (!product?.sizes || !Array.isArray(product.sizes)) return [];
    const colorsList = (product.colors || []).map((c) => String(c).trim().toLowerCase());
    return product.sizes
      .map((s) => String(s).trim())
      .filter((s) => s && !colorsList.includes(s.toLowerCase()));
  }, [product?.sizes, product?.colors]);

  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [selectedSize, setSelectedSize] = useState(validSizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  React.useEffect(() => {
    if (product) {
      const imgs = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : (product.image ? [product.image] : ['/assets/Hero1.png']);
      setActiveImage(imgs[0]);
      setSelectedSize(validSizes[0] || '');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
    }
  }, [product?.id, validSizes]);

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedSize: validSizes.length > 0 ? selectedSize : '',
      selectedColor,
      quantity,
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
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
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 8,
          border: '1px solid #333333',
          maxWidth: 900,
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product quick view"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: '#ffffff',
            border: '1.5px solid #000000',
            color: '#000000',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
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
          <X size={18} strokeWidth={2.2} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            maxHeight: '88vh',
          }}
          className="quickview-grid"
        >
          {/* Left: Product Image Stage & Gallery */}
          <div
            style={{
              position: 'relative',
              background: '#f8f8f8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px',
              minHeight: 380,
              borderRight: '1px solid #e5e5e5',
            }}
          >


            {/* Main Active Image */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 240 }}>
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                src={activeImage}
                alt={product.name}
                style={{
                  maxWidth: '90%',
                  maxHeight: 280,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.12))',
                }}
              />
            </div>

            {/* Thumbnail Gallery Strip */}
            {productImages.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 14,
                  width: '100%',
                  zIndex: 2,
                }}
              >
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 4,
                      padding: 3,
                      background: '#ffffff',
                      border: activeImage === img ? '2px solid #000000' : '1px solid #d1d1d1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase */}
          <div
            style={{
              padding: '36px 32px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              background: '#ffffff',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#999999',
                marginBottom: 6,
                display: 'block',
              }}
            >
              {product.categoryLabel || 'Maison Singhar Edition'}
            </span>

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '1.9rem',
                fontWeight: 500,
                color: '#111111',
                letterSpacing: '0.01em',
                textTransform: 'none',
                marginBottom: 10,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#000000" stroke="#000000" />
                ))}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 500 }}>
                {product.rating || '5.0'} ({product.reviewsCount || 12} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                marginBottom: 18,
                paddingBottom: 16,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.8rem',
                  fontWeight: 500,
                  color: '#111111',
                  letterSpacing: '0.01em',
                }}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: '0.95rem',
                    color: '#999999',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: '#444444',
                marginBottom: 24,
                fontFamily: 'var(--font-body)',
              }}
            >
              {product.description || "Meticulously handcrafted Pakistani royal heirloom piece featuring authentic artisanal finish, high-grade lustre and bespoke heritage styling."}
            </p>

            {/* Sizes */}
            {validSizes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#666666',
                    marginBottom: 8,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Select Size
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {validSizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 2,
                          background: active ? '#000000' : '#ffffff',
                          border: active ? '1.5px solid #000000' : '1px solid #d1d1d1',
                          color: active ? '#ffffff' : '#000000',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#666666',
                    marginBottom: 8,
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  Finish: <strong style={{ color: '#000000' }}>{selectedColor}</strong>
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.colors.map((color) => {
                    const active = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 2,
                          backgroundColor: active ? '#000000' : '#ffffff',
                          border: active ? '1.5px solid #000000' : '1px solid #d1d1d1',
                          color: active ? '#ffffff' : '#000000',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Add to Bag */}
            <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #000000',
                  borderRadius: 2,
                  padding: '4px 8px',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '0 8px',
                    color: '#000000',
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, padding: '0 10px', color: '#000000' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '0 8px',
                    color: '#000000',
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  background: '#000000',
                  color: '#ffffff',
                  border: '1.5px solid #000000',
                  borderRadius: 2,
                  padding: '12px 24px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#262626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#000000';
                }}
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
