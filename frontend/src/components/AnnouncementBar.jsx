import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const DEFAULT_MESSAGES = [
  "✦ COMPLIMENTARY NATIONWIDE EXPRESS DELIVERY ON ORDERS OVER RS. 3,000 ✦",
  "✦ JEE BHAR KE SAJAO · 100% HANDCRAFTED PAKISTANI ROYAL HEIRLOOMS ✦",
  "✦ CASH ON DELIVERY AVAILABLE WORLDWIDE ✦",
  "✦ THE NEW BRIDAL TROUSSEAU ARCHIVE IS LIVE ✦"
];

export default function AnnouncementBar() {
  const { settings } = useStore();
  const [index, setIndex] = useState(0);

  const messages = useMemo(() => {
    const list = [];
    if (settings?.offer?.enabled) {
      const off = settings.offer;
      const discountText = off.discountType === 'percent' ? `${off.discountValue}% OFF` : `RS. ${Number(off.discountValue).toLocaleString()} OFF`;
      list.push(`✦ ${off.badgeText || 'SPECIAL OFFER'}: ${off.title.toUpperCase()} · USE CODE "${off.code}" FOR ${discountText} ✦`);
    }
    if (settings?.hero?.announcement) {
      list.push(settings.hero.announcement);
    }
    return list.length > 0 ? list : DEFAULT_MESSAGES;
  }, [settings?.offer, settings?.hero?.announcement]);

  useEffect(() => {
    if (index >= messages.length) setIndex(0);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [messages.length, index]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div
      style={{
        backgroundColor: '#000000',
        borderBottom: '1px solid #222222',
        color: '#ffffff',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        padding: '8px 20px',
        position: 'relative',
        zIndex: 102,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      {/* Left Chevron */}
      <button
        onClick={handlePrev}
        aria-label="Previous announcement"
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        <ChevronLeft size={14} />
      </button>

      {/* Center Ticker Text */}
      <div
        style={{
          textAlign: 'center',
          overflow: 'hidden',
          minHeight: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          key={index}
          style={{
            display: 'inline-block',
            animation: 'fadeIn 0.35s ease',
            color: '#ffffff',
            fontWeight: 800,
          }}
        >
          {MESSAGES[index]}
        </span>
      </div>

      {/* Right Chevron */}
      <button
        onClick={handleNext}
        aria-label="Next announcement"
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        <ChevronRight size={14} />
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
