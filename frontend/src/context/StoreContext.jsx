import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FEATURED_PRODUCTS as initialProducts,
  CATEGORIES as initialCategories,
  HERO_DATA as initialHero,
  ABOUT_DATA as initialAbout,
} from '../data/products';
import { api } from '../services/api';

const StoreContext = createContext();

export const DEFAULT_OFFER = {
  enabled: false,
  badgeText: 'LIMITED TIME OFFER',
  title: 'Special 15% Off on Royal Heirlooms',
  code: 'SINGHAR15',
  discountType: 'percent', // 'percent' or 'fixed'
  discountValue: 15,
  minOrderAmount: 0,
};

export function StoreProvider({ children }) {
  // Products State
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('singhar_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out legacy mock products (ids 1..6 or handbag categories)
        if (Array.isArray(parsed) && parsed.some((p) => [1, 2, 3, 4, 5, 6].includes(p.id) || p.category === 'handbags')) {
          localStorage.removeItem('singhar_products');
          return [];
        }
        return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('singhar_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('singhar_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('singhar_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          hero: initialHero,
          about: initialAbout,
          categories: initialCategories,
          offer: DEFAULT_OFFER,
          ...parsed,
          offer: parsed.offer ? { ...DEFAULT_OFFER, ...parsed.offer } : DEFAULT_OFFER,
        };
      } catch {
        return {
          hero: initialHero,
          about: initialAbout,
          categories: initialCategories,
          offer: DEFAULT_OFFER,
        };
      }
    }
    return {
      hero: initialHero,
      about: initialAbout,
      categories: initialCategories,
      offer: DEFAULT_OFFER,
    };
  });

  // Currency State — PKR is default, prices are stored in PKR
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('singhar_currency') || 'PKR';
  });

  // All rates are relative to PKR (base currency)
  const CURRENCY_RATES = {
    PKR: { rate: 1,        symbol: 'Rs. ', decimals: 0 },
    USD: { rate: 0.00357,  symbol: '$',    decimals: 2 },
    CAD: { rate: 0.00486,  symbol: 'CA$',  decimals: 2 },
    GBP: { rate: 0.00282,  symbol: '£',    decimals: 2 },
    AED: { rate: 0.01311,  symbol: 'AED ', decimals: 0 },
  };

  const handleSetCurrency = (cur) => {
    setCurrency(cur);
    localStorage.setItem('singhar_currency', cur);
  };

  // priceInPKR → formatted string in selected currency
  const formatPrice = (priceInPKR) => {
    if (priceInPKR === null || priceInPKR === undefined || isNaN(priceInPKR)) return '';
    const num = Number(priceInPKR);
    const curr = CURRENCY_RATES[currency] || CURRENCY_RATES.PKR;
    const converted = num * curr.rate;
    if (curr.decimals === 0) {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(curr.decimals)}`;
  };

  // Backend connection status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('singhar_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('singhar_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load from Backend on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const health = await api.checkHealth();
        if (health && health.status === 'ok') {
          setIsBackendConnected(true);

          // Fetch products
          const prodRes = await api.getProducts();
          if (prodRes && prodRes.success && prodRes.data) {
            setProducts(prodRes.data);
          }

          // Fetch orders
          const ordRes = await api.getOrders();
          if (ordRes && ordRes.success && ordRes.data) {
            setOrders(ordRes.data);
          }

          // Fetch inquiries
          const inqRes = await api.getInquiries();
          if (inqRes && inqRes.success && inqRes.data) {
            setInquiries(inqRes.data);
          }

          // Fetch settings
          const setRes = await api.getSettings();
          if (setRes && setRes.success && setRes.data) {
            setSettings(setRes.data);
          }

          // Verify active session token with backend
          const token = localStorage.getItem('singhar_admin_token');
          if (token) {
            const authCheck = await api.verifyToken();
            if (authCheck && authCheck.success && authCheck.user) {
              setIsAdminLoggedIn(true);
              setAdminUser(authCheck.user);
            } else if (authCheck && (authCheck.status === 401 || authCheck.error)) {
              // Token expired or invalid
              setIsAdminLoggedIn(false);
              setAdminUser(null);
              localStorage.removeItem('singhar_admin_token');
              localStorage.removeItem('singhar_admin_auth');
              localStorage.removeItem('singhar_admin_user');
            }
          }
        }
      } catch (err) {
        console.info('Running in client-cached mode:', err.message);
      }
    }
    loadBackendData();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('singhar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('singhar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('singhar_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('singhar_settings', JSON.stringify(settings));
  }, [settings]);

  // Product CRUD
  const addProduct = async (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
      price: Number(newProduct.price),
      rating: 5.0,
      reviewsCount: 0,
      code: `${newProduct.price}$`,
    };
    setProducts((prev) => [productWithId, ...prev]);

    // Backend sync
    await api.createProduct(productWithId);
    return productWithId;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields, price: Number(updatedFields.price || p.price) } : p))
    );

    // Backend sync
    await api.updateProduct(id, updatedFields);
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Backend sync
    await api.deleteProduct(id);
  };

  // Order Actions
  const addOrder = async (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Backend sync
    await api.createOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    // Backend sync
    await api.updateOrderStatus(orderId, newStatus);
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));

    // Backend sync
    await api.deleteOrder(orderId);
  };

  // Inquiry Actions
  const addInquiry = async (inquiryData) => {
    const newInquiry = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString(),
      status: 'Unread',
      ...inquiryData,
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    // Backend sync
    await api.createInquiry(newInquiry);
  };

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
    );

    // Backend sync
    await api.updateInquiryStatus(inquiryId, newStatus);
  };

  const deleteInquiry = async (inquiryId) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));

    // Backend sync
    await api.deleteInquiry(inquiryId);
  };

  // Settings Actions
  const updateHeroSettings = async (updatedHero) => {
    const updated = { ...settings, hero: { ...settings.hero, ...updatedHero } };
    setSettings(updated);
    await api.updateSettings(updated);
  };

  const updateAboutSettings = async (updatedAbout) => {
    const updated = { ...settings, about: { ...settings.about, ...updatedAbout } };
    setSettings(updated);
    await api.updateSettings(updated);
  };

  const updateOfferSettings = async (updatedOffer) => {
    const currentOffer = settings.offer || DEFAULT_OFFER;
    const mergedOffer = { ...currentOffer, ...updatedOffer };
    const updated = { ...settings, offer: mergedOffer };
    setSettings(updated);
    localStorage.setItem('singhar_settings', JSON.stringify(updated));
    await api.updateSettings(updated);
    return { success: true };
  };

  const resetAllData = async () => {
    localStorage.removeItem('singhar_products');
    localStorage.removeItem('singhar_orders');
    localStorage.removeItem('singhar_inquiries');
    localStorage.removeItem('singhar_settings');
    setProducts(initialProducts);
    setOrders([]);
    setInquiries([]);
    setSettings({
      hero: initialHero,
      about: initialAbout,
      categories: initialCategories,
      offer: DEFAULT_OFFER,
    });
    await api.resetDatabase();
  };

  // Real Admin Auth Actions
  const adminLogin = async (credentials) => {
    let username = '';
    let password = '';
    if (typeof credentials === 'string') {
      password = credentials.trim();
    } else if (credentials && typeof credentials === 'object') {
      username = (credentials.username || '').trim();
      password = (credentials.password || '').trim();
    }

    if (!password) {
      return { success: false, error: 'Please enter your administrator password.' };
    }

    try {
      const res = await api.adminLogin({ username, password, pin: password });
      if (res && res.success && res.token) {
        setIsAdminLoggedIn(true);
        setAdminUser(res.user);
        localStorage.setItem('singhar_admin_token', res.token);
        localStorage.setItem('singhar_admin_auth', 'true');
        localStorage.setItem('singhar_admin_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return {
        success: false,
        error: res?.error || 'Invalid administrator username or password.',
      };
    } catch (err) {
      console.warn('Backend admin login request failed:', err);
      return {
        success: false,
        error: 'Authentication server connection error. Please try again.',
      };
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('singhar_admin_token');
    localStorage.removeItem('singhar_admin_auth');
    localStorage.removeItem('singhar_admin_user');
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    return await api.changePassword(currentPassword, newPassword);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        inquiries,
        settings,
        currency,
        setCurrency: handleSetCurrency,
        CURRENCY_RATES,
        formatPrice,
        isBackendConnected,
        isAdminLoggedIn,
        adminUser,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        updateHeroSettings,
        updateAboutSettings,
        updateOfferSettings,
        resetAllData,
        adminLogin,
        adminLogout,
        changeAdminPassword,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
