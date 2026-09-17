// In development: uses localhost:5000
// In production (Netlify): uses VITE_API_URL env variable set in Netlify dashboard
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : window.location.port === '5000'
  ? '/api'
  : 'http://localhost:5000/api';


async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('singhar_admin_token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      // Try parsing error message from JSON response
      try {
        const errorData = await res.json();
        if (errorData && errorData.error) {
          return { ...errorData, status: res.status };
        }
      } catch (_) {}
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    // If localhost:5000 directly fails, try direct relative path /api
    try {
      const fallbackRes = await fetch(`/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        ...options,
      });
      if (fallbackRes.ok) return await fallbackRes.json();
    } catch (_) {}

    console.warn(`[Singhar API] Request to ${endpoint} failed, utilizing local fallback.`, err.message);
    return null;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchAPI('/health'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => fetchAPI(`/products/${id}`),
  createProduct: (productData) =>
    fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),
  updateProduct: (id, productData) =>
    fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),
  deleteProduct: (id) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: () => fetchAPI('/orders'),
  createOrder: (orderData) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  updateOrderStatus: (id, status) =>
    fetchAPI(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteOrder: (id) =>
    fetchAPI(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Inquiries
  getInquiries: () => fetchAPI('/inquiries'),
  createInquiry: (inquiryData) =>
    fetchAPI('/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    }),
  updateInquiryStatus: (id, status) =>
    fetchAPI(`/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id) =>
    fetchAPI(`/inquiries/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => fetchAPI('/settings'),
  updateSettings: (settingsData) =>
    fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }),
  resetDatabase: () =>
    fetchAPI('/settings/reset', {
      method: 'POST',
    }),

  // Auth
  adminLogin: (credentials) => {
    const payload = typeof credentials === 'object' ? credentials : { pin: credentials };
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyToken: () => fetchAPI('/auth/verify'),
  changePassword: (currentPassword, newPassword) =>
    fetchAPI('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Image Upload  (multipart/form-data — field name: "image")
  uploadImage: async (file) => {
    if (!file) return null;

    // Try backend upload
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.url) {
          const backendBase = window.location.port === '5000' ? '' : 'http://localhost:5000';
          return { success: true, url: `${backendBase}${data.url}` };
        }
      }
    } catch (err) {
      console.warn('[Singhar API] Server upload failed, falling back to local storage image reader:', err.message);
    }

    // Fallback: Convert to Base64 Data URL so user can always add/edit images even without backend running!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result });
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Could not read image file.' });
      };
      reader.readAsDataURL(file);
    });
  },
};
