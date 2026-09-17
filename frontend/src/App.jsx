import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

import { StoreProvider, useStore } from './context/StoreContext';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InstagramFeed from './components/InstagramFeed';
import AboutSection from './components/AboutSection';
import ShopTheFaves from './components/ShopTheFaves';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import ProductQuickView from './components/ProductQuickView';
import ContactModal from './components/ContactModal';
import CatalogView from './components/CatalogView';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';

function Toast({ message, isVisible }) {
  if (!isVisible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2000,
        background: '#111111',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: 9999,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.82rem',
        fontWeight: 600,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--pink-accent)' }}>✦</span>
      {message}
    </div>
  );
}

function MainStoreApp() {
  const { isAdminLoggedIn, adminLogout, addOrder } = useStore();
  const [currentView, setCurrentView] = useState('store'); // 'store' or 'admin'

  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 2400);
  };

  // URL Routing (/admin, #admin, ?admin=true) & Global Hotkey (Ctrl+Shift+A)
  useEffect(() => {
    const checkAdminRoute = () => {
      const isSubdomainAdmin = window.location.hostname.startsWith('admin.') || window.location.hostname.startsWith('admin-');
      const isHashAdmin = window.location.hash === '#admin';
      const isPathAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
      const isQueryAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

      if (isSubdomainAdmin || isHashAdmin || isPathAdmin || isQueryAdmin) {
        setCurrentView('admin');
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminPortal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminLoggedIn]);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const key = `${product.id}-${product.selectedSize || 'default'}`;
      const existing = prev.find((i) => `${i.id}-${i.selectedSize || 'default'}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.selectedSize || 'default'}` === key
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    showToast(`${product.name.substring(0, 26)}... added to bag`);
  }, []);

  const handleUpdateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && (i.selectedSize || 'default') === (size || 'default')
          ? { ...i, quantity: newQty }
          : i
      )
    );
  };

  const handleRemoveItem = (id, size) => {
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && (i.selectedSize || 'default') === (size || 'default')))
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleNavigateToCategory = (categoryId) => {
    setCatalogCategory(categoryId);
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPortal = () => {
    setCurrentView('admin');
    window.location.hash = '#admin';
  };

  const totalCartItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // If Admin View is active
  if (currentView === 'admin') {
    // If not authenticated, render dedicated Luxury Admin Login Page
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => {
            showToast('Welcome to Maison Singhar Atelier Suite');
          }}
          onBackToStore={() => {
            setCurrentView('store');
            if (window.location.hash === '#admin') {
              try {
                history.pushState('', document.title, window.location.pathname + window.location.search);
              } catch (_) {
                window.location.hash = '';
              }
            }
          }}
        />
      );
    }

    // Authenticated: Render Admin Dashboard
    return (
      <AdminDashboard
        onSwitchToStore={() => {
          setCurrentView('store');
          if (window.location.hash === '#admin') {
            try {
              history.pushState('', document.title, window.location.pathname + window.location.search);
            } catch (_) {
              window.location.hash = '';
            }
          }
        }}
      />
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top Heritage Announcement Banner */}
      <AnnouncementBar />

      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(id) => {
          if (id === 'contact') {
            setIsContactOpen(true);
          } else {
            setActiveTab(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartItems}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Main Content */}
      {activeTab === 'catalog' ? (
        <CatalogView
          initialCategory={catalogCategory}
          onBackToHome={handleBackToHome}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      ) : (
        <main>
          {/* Hero Section - Full-Width Slider */}
          <Hero
            onShopClick={() => {
              const section = document.getElementById('shop-faves');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
            onLearnMoreClick={() => {
              const section = document.getElementById('about-section');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Instagram Lookbook Feed (Follow Us On Instagram) */}
          <InstagramFeed instagramHandle="singharrofficial" />

          {/* Featured Heirlooms Product Grid */}
          <ShopTheFaves
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />

          {/* Trust Badges + Bridal Spotlight About Section */}
          <AboutSection onContactClick={() => setIsContactOpen(true)} />
        </main>
      )}

      {/* Footer */}
      <Footer
        onNavigate={handleNavigateToCategory}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          setQuickViewProduct(p);
        }}
      />

      {/* Product Quick View */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p) => {
          handleAddToCart(p);
          setIsCartOpen(true);
        }}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderPlaced={() => {
          setCartItems([]);
          showToast('Order placed! We will contact you shortly. ✦');
        }}
      />



      {/* Toast Notification */}
      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainStoreApp />
    </StoreProvider>
  );
}
