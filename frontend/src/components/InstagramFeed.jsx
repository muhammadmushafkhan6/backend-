import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ExternalLink } from 'lucide-react';

const InstagramBlackIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const INSTA_POSTS = [
  {
    id: 1,
    image: '/assets/insta1.jfif',
    fallback: '/assets/Hero1.png',
    isReel: true,
    likes: '1.4k',
    comments: '48',
    reelEmbedUrl: 'https://www.instagram.com/reel/DJuBWp9ILmR/embed',
    postUrl: 'https://www.instagram.com/reel/DJuBWp9ILmR/',
  },
  {
    id: 2,
    image: '/assets/insta2.jfif',
    fallback: '/assets/Hero2.png',
    likes: '920',
    comments: '34',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 3,
    image: '/assets/insta3.jfif',
    fallback: '/assets/Hero3.png',
    likes: '1.1k',
    comments: '56',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 4,
    image: '/assets/insta4.jfif',
    fallback: '/assets/Hero1.png',
    likes: '850',
    comments: '29',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 5,
    image: '/assets/insta5.jfif',
    fallback: '/assets/Hero2.png',
    likes: '1.2k',
    comments: '62',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 6,
    image: '/assets/insta6.jfif',
    fallback: '/assets/Hero3.png',
    likes: '780',
    comments: '18',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 7,
    image: '/assets/insta7.jfif',
    fallback: '/assets/Hero1.png',
    likes: '940',
    comments: '41',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 8,
    image: '/assets/insta8.jfif',
    fallback: '/assets/Hero2.png',
    likes: '1.5k',
    comments: '77',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 9,
    image: '/assets/insta9.jfif',
    fallback: '/assets/Hero3.png',
    likes: '890',
    comments: '35',
    postUrl: 'https://instagram.com/singharrofficial',
  },
  {
    id: 10,
    image: '/assets/insta10.jfif',
    fallback: '/assets/Hero1.png',
    likes: '1.3k',
    comments: '50',
    postUrl: 'https://instagram.com/singharrofficial',
  },
];

export default function InstagramFeed({ instagramHandle = "singharrofficial" }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [imgErrors, setImgErrors] = useState({});
  const [activeReel, setActiveReel] = useState(null);
  const instaUrl = `https://instagram.com/${instagramHandle.replace('@', '')}`;

  const handleTileClick = (e, post) => {
    if (post.isReel && post.reelEmbedUrl) {
      e.preventDefault();
      setActiveReel(post);
    }
  };

  return (
    <section
      id="instagram-section"
      style={{
        background: '#ffffff',
        padding: '80px 0 90px',
        position: 'relative',
        borderBottom: '1px solid #e5e5e5',
      }}
    >
      <div className="container">
        {/* Instagram Profile Header Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: '#ffffff',
              padding: '8px 20px 8px 12px',
              borderRadius: 9999,
              border: '1.5px solid #000000',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              marginBottom: 16,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
            }}
          >
            {/* Black & White Ring around Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#000000',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo.png"
                  alt="Singhar Avatar"
                  style={{ width: '85%', height: '85%', objectFit: 'contain', filter: 'brightness(1.2)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    color: '#000000',
                    letterSpacing: '0.02em',
                  }}
                >
                  @{instagramHandle}
                </span>
                <span
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    fontWeight: 900,
                  }}
                >
                  ✓
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#666666', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                محبت ، ہنر ، وراثت · 1k+ Followers
              </span>
            </div>

            {/* Follow Button */}
            <span
              style={{
                marginLeft: 8,
                background: '#000000',
                color: '#ffffff',
                padding: '5px 14px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Follow
            </span>
          </a>

          {/* Section Main Title */}
          <h2
            style={{
              fontFamily: 'var(--font-brand)',
              fontSize: 'clamp(1.4rem, 2.8vw, 2rem)',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Follow Us On Instagram
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#555555',
              maxWidth: 580,
            }}
          >
            Tag <strong style={{ color: '#000000' }}>@{instagramHandle}</strong> to be featured in our royal bridal gallery
          </p>
        </div>

        {/* 5-Column Clean Monochrome Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 14,
          }}
          className="insta-grid"
        >
          {INSTA_POSTS.map((post, idx) => {
            const imgSrc = imgErrors[idx] ? post.fallback : post.image;
            return (
              <motion.a
                key={post.id || idx}
                href={post.postUrl || instaUrl}
                target={post.isReel ? '_self' : '_blank'}
                rel="noopener noreferrer"
                onClick={(e) => handleTileClick(e, post)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                onMouseEnter={() => setHoveredId(idx)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: 4,
                  display: 'block',
                  textDecoration: 'none',
                  backgroundColor: '#f5f5f5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: hoveredId === idx ? '1px solid #000000' : '1px solid #e5e5e5',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s',
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Instagram @singharrofficial post ${idx + 1}`}
                  onError={() => {
                    setImgErrors((prev) => ({ ...prev, [idx]: true }));
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: hoveredId === idx ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </motion.a>
            );
          })}
        </div>

        {/* Bottom Direct CTA */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#000000',
              color: '#ffffff',
              padding: '11px 28px',
              borderRadius: 9999,
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '1.5px solid #000000',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            }}
          >
            <InstagramBlackIcon size={16} />
            <span>Visit @{instagramHandle} on Instagram</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Live Instagram Reel Player Modal */}
      <AnimatePresence>
        {activeReel && (
          <div
            className="modal-backdrop-light"
            onClick={() => setActiveReel(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #333333',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                width: '100%',
                maxWidth: 440,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  background: '#000000',
                  color: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InstagramBlackIcon size={18} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    @{instagramHandle} Reel
                  </span>
                </div>

                <button
                  onClick={() => setActiveReel(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.85,
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Live Embedded Instagram Reel */}
              <div style={{ width: '100%', height: 560, background: '#f5f5f5' }}>
                <iframe
                  src={activeReel.reelEmbedUrl}
                  title="Instagram Reel"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  allow="encrypted-media"
                  style={{ border: 'none', display: 'block' }}
                />
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '12px 18px',
                  background: '#ffffff',
                  borderTop: '1px solid #e5e5e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.76rem', color: '#666666', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                  Watch directly from Instagram
                </span>
                <a
                  href={activeReel.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: 9999,
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Open in Instagram <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .insta-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; }
        }
        @media (max-width: 600px) {
          .insta-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
        }
      `}</style>
    </section>
  );
}
