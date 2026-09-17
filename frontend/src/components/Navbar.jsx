import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenCart,
  cartCount,
  onOpenContact,
  onOpenAdmin,
}) {
  const { currency, setCurrency, CURRENCY_RATES, isAdminLoggedIn } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shopCategories = [
    { id: 'all', label: 'All Collections' },
    { id: 'necklaces', label: 'Necklaces & Chokers' },
    { id: 'earrings', label: 'Earrings & Jhumkas' },
    { id: 'rings', label: 'Artisan Rings' },
    { id: 'bangles', label: 'Bangles & Kadas' },
  ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    if (id === 'about') {
      const el = document.getElementById('about-section');
      if (el) {
        if (activeTab !== 'home') setActiveTab('home');
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        setActiveTab('home');
      }
    } else {
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#000000',
        borderBottom: '1px solid #222222',
        boxShadow: isScrolled ? '0 6px 25px rgba(0, 0, 0, 0.45)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '14px 20px',
        }}
      >
        {/* Left Side: Navigation Links (Home, Shop ▾, About) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            justifySelf: 'start',
          }}
          className="navbar-desktop-nav"
        >
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'home' ? '#ffffff' : '#bbbbbb',
              fontFamily: 'var(--font-brand)',
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '6px 0',
              position: 'relative',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = activeTab === 'home' ? '#ffffff' : '#bbbbbb')}
          >
            Home
            {activeTab === 'home' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1.5,
                  background: '#ffffff',
                }}
              />
            )}
          </button>

          {/* Shop with Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            <button
              onClick={() => handleNavClick('catalog')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'catalog' ? '#ffffff' : '#bbbbbb',
                fontFamily: 'var(--font-brand)',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '6px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = activeTab === 'catalog' ? '#ffffff' : '#bbbbbb')}
            >
              Shop
              <ChevronDown size={13} style={{ opacity: 0.8 }} />
            </button>

            {/* Dropdown Menu */}
            {isShopDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 6,
                  background: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                  minWidth: 200,
                  overflow: 'hidden',
                  zIndex: 1000,
                  padding: '6px 0',
                }}
              >
                {shopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick('catalog')}
                    style={{
                      width: '100%',
                      padding: '10px 18px',
                      background: 'none',
                      border: 'none',
                      color: '#cccccc',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = '#cccccc';
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* About */}
          <button
            onClick={() => handleNavClick('about')}
            style={{
              background: 'none',
              border: 'none',
              color: '#bbbbbb',
              fontFamily: 'var(--font-brand)',
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#bbbbbb')}
          >
            About
          </button>
        </nav>

        {/* Center: Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: 'center',
            height: 'clamp(50px, 6.5vw, 68px)',
          }}
        >
          <img
            src="/logo.png"
            alt="Singhar Logo"
            style={{
              height: 'clamp(80px, 9.5vw, 115px)',
              width: 'auto',
              maxWidth: 'clamp(180px, 24vw, 290px)',
              objectFit: 'contain',
              display: 'block',
              transform: 'scale(1.35)',
              transformOrigin: 'center',
              filter: 'brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
              transition: 'transform 0.25s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.42)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.35)')}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'block';
              }
            }}
          />
          <span
            style={{
              display: 'none',
              fontFamily: 'var(--font-brand)',
              fontSize: '1.9rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            SINGHAR
          </span>
        </div>

        {/* Right Side: Currency Selector, Search, Account/Admin, Cart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            justifySelf: 'end',
          }}
        >
          {/* Currency / Region Dropdown */}
          <div style={{ position: 'relative' }} className="currency-selector-hide">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#cccccc',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 6px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#cccccc')}
            >
              <span>{currency === 'PKR' ? 'Pakistan | PKR Rs.' : `${currency} ${CURRENCY_RATES[currency]?.symbol || ''}`}</span>
              <ChevronDown size={12} />
            </button>

            {isCurrencyDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  minWidth: 140,
                  overflow: 'hidden',
                  zIndex: 1000,
                }}
              >
                {Object.keys(CURRENCY_RATES).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 14px',
                      background: currency === cur ? 'rgba(255,255,255,0.15)' : 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: currency === cur ? 800 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{cur}</span>
                    <span style={{ fontSize: '0.68rem', color: '#888888' }}>{CURRENCY_RATES[cur].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Collection"
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cccccc')}
          >
            <Search size={18} />
          </button>

          {/* Admin Portal Access (Only visible to logged-in Admin) */}
          {isAdminLoggedIn && (
            <button
              onClick={onOpenAdmin}
              aria-label="Admin Dashboard"
              title="Admin Dashboard (Logged In)"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                borderRadius: 9999,
                color: '#ffffff',
                cursor: 'pointer',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.68rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
            >
              <ShieldCheck size={13} color="#4ade80" />
              <span>ADMIN</span>
            </button>
          )}

          {/* Shopping Bag / Cart */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              cursor: 'pointer',
              padding: 4,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#cccccc')}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -7,
                  background: '#ffffff',
                  color: '#000000',
                  borderRadius: '50%',
                  width: 17,
                  height: 17,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.66rem',
                  fontWeight: 900,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: 4,
              display: 'none',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#0a0a0a',
              borderTop: '1px solid #222222',
              overflow: 'hidden',
            }}
          >
            <div className="container" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                  onClick={() => handleNavClick('home')}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '8px 0',
                    color: '#ffffff',
                    fontFamily: 'var(--font-brand)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('catalog')}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '8px 0',
                    color: '#ffffff',
                    fontFamily: 'var(--font-brand)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Shop Collections
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '8px 0',
                    color: '#ffffff',
                    fontFamily: 'var(--font-brand)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  About Atelier
                </button>
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333333',
                      borderRadius: 8,
                      textAlign: 'left',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontFamily: 'var(--font-brand)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <ShieldCheck size={16} color="#4ade80" /> Admin Dashboard
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 860px) {
          .navbar-desktop-nav { display: none !important; }
          .navbar-mobile-toggle { display: block !important; }
          .currency-selector-hide { display: none !important; }
        }
      `}</style>
    </header>
  );
}
