import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// 3 Hero Background Images
const HERO_IMAGES = [
  '/assets/Hero1.png',
  '/assets/Hero2.png',
  '/assets/Hero3.png',
];

const FALLBACK_IMAGES = [
  '/assets/Hero1.png',
  '/assets/Hero2.png',
  '/assets/Hero3.png',
];

export default function Hero({ onShopClick, onLearnMoreClick }) {
  const { settings } = useStore();
  const heroData = settings.hero || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const currentImageSrc = imageErrors[currentIndex]
    ? FALLBACK_IMAGES[currentIndex % FALLBACK_IMAGES.length]
    : HERO_IMAGES[currentIndex];

  return (
    <section
      style={{
        position: 'relative',
        height: 'clamp(380px, 56vh, 500px)',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* Background Images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={currentImageSrc}
            alt="Hero Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'brightness(0.68) contrast(1.1)',
              display: 'block',
            }}
            onError={() => {
              setImageErrors((prev) => ({ ...prev, [currentIndex]: true }));
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Pure Black Vignette Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.75) 70%, rgba(0, 0, 0, 0.95) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#000000';
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          color: '#ffffff',
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#ffffff';
          e.currentTarget.style.color = '#000000';
          e.currentTarget.style.borderColor = '#ffffff';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Hero Center Editorial Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 880,
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Subtle Top Fleuron */}
        <div style={{ marginBottom: 18 }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#ffffff',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              opacity: 0.9,
            }}
          >
            <span>✧</span>
            <span>Maison Singhar · Haute Joaillerie</span>
            <span>✧</span>
          </span>
        </div>

        {/* Cinematic Title */}
        <h1
          style={{
            fontFamily: 'var(--font-brand)',
            fontSize: 'clamp(1.5rem, 3.2vw, 2.4rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textShadow: '0 2px 18px rgba(0, 0, 0, 0.8)',
            marginBottom: 12,
          }}
        >
          Khaas Kahaani
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.88rem, 1.3vw, 1.08rem)',
            color: '#e5e5e5',
            lineHeight: 1.6,
            maxWidth: 520,
            marginBottom: 24,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        >
          {heroData.tagline || "Each Singhar jewel is a timeless testament to royal heritage craftsmanship and exquisite gemmology."}
        </p>

        {/* Center Pill CTA Button (Shop Now) */}
        <div>
          <button
            onClick={onShopClick}
            style={{
              background: '#ffffff',
              color: '#000000',
              border: '1.5px solid #ffffff',
              padding: '11px 34px',
              borderRadius: 9999,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)',
              transition: 'all 0.25s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.25)';
            }}
          >
            {heroData.ctaText || "Shop Now"}
          </button>
        </div>
      </div>

      {/* Bottom Progress Indicator Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: currentIndex === i ? 24 : 8,
              height: 8,
              borderRadius: 9999,
              background: currentIndex === i ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
