import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminInquiries from './AdminInquiries';
import AdminSettings from './AdminSettings';
import adminLogo from '../../assets/admin-logo.png';

export default function AdminDashboard({ onSwitchToStore }) {
  const { products, orders, inquiries, adminLogout } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Computed metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
  const unreadInquiries = inquiries.filter((i) => i.status === 'Unread').length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', count: products.length, icon: ShoppingBag },
    { id: 'orders', label: 'Orders', count: pendingOrders > 0 ? pendingOrders : null, icon: Package },
    { id: 'inquiries', label: 'Inquiries', count: unreadInquiries > 0 ? unreadInquiries : null, icon: MessageSquare },
    { id: 'settings', label: 'Store Content', icon: Settings },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#faf8fa',
        fontFamily: 'var(--font-body)',
        color: 'var(--dark)',
      }}
    >
      {/* Admin Sidebar */}
      <aside
        style={{
          width: 260,
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 18px',
          flexShrink: 0,
        }}
        className="admin-sidebar"
      >
        <div>
          {/* Logo Brand in Admin */}
          <div
            style={{
              padding: '0 8px 24px 8px',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  background: '#0a0a0a',
                  padding: '6px 12px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                }}
              >
                <img
                  src={adminLogo || '/admin-logo.png'}
                  alt="Singhar Admin Logo"
                  onError={(e) => {
                    if (e.currentTarget.src.includes('admin-logo.png.png')) return;
                    e.currentTarget.src = '/admin-logo.png.png';
                  }}
                  style={{
                    height: 38,
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-brand)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    letterSpacing: '0.04em',
                    color: '#0a0a0a',
                    textTransform: 'uppercase',
                  }}
                >
                  SINGHAR
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#666666',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  Admin Suite
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 14px',
                    borderRadius: 12,
                    border: 'none',
                    background: isActive ? 'var(--pink-soft)' : 'transparent',
                    color: isActive ? 'var(--pink-pill)' : 'var(--dark-sub)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#faf8fa';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={18} color={isActive ? 'var(--pink-pill)' : 'var(--text-muted)'} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== null && item.count !== undefined && (
                    <span
                      style={{
                        background: isActive ? 'var(--pink-pill)' : '#e5e7eb',
                        color: isActive ? '#ffffff' : 'var(--dark)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 9999,
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: View Store & Logout */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onSwitchToStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 12,
              border: '1px solid var(--border-pink)',
              background: '#ffffff',
              color: 'var(--pink-pill)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--pink-soft)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <ExternalLink size={14} />
            View Live Store
          </button>

          <button
            onClick={() => {
              adminLogout();
              onSwitchToStore();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '9px 14px',
              borderRadius: 12,
              border: 'none',
              background: '#fff0f3',
              color: '#b91c1c',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Content Stage */}
      <main style={{ flexGrow: 1, padding: '32px 36px', overflowY: 'auto', maxHeight: '100vh' }}>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            paddingBottom: 18,
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pink-pill)', textTransform: 'uppercase' }}>
              Management Console
            </span>
            <h1 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--dark)' }}>
              {activeTab === 'overview' && 'Store Performance & Analytics'}
              {activeTab === 'products' && 'Product Catalog'}
              {activeTab === 'orders' && 'Orders Fulfillment'}
              {activeTab === 'inquiries' && 'Customer Inquiries'}
              {activeTab === 'settings' && 'Storefront Settings'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={onSwitchToStore}
              className="pill-btn-white"
              style={{ border: '1px solid var(--border-light)' }}
            >
              ← Back to Store
            </button>
          </div>
        </div>

        {/* Tab Content Views */}
        {activeTab === 'overview' && (
          <div>
            {/* Metric Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }} className="admin-metrics-grid">
              {/* Total Revenue */}
              <div style={{ background: '#ffffff', padding: 22, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Revenue</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f5f5', border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontWeight: 800, fontSize: '0.74rem', fontFamily: 'var(--font-brand)' }}>
                    Rs
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', display: 'block', letterSpacing: '-0.01em' }}>
                  Rs. {Number(totalRevenue || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <TrendingUp size={12} /> Active Lifetime Sales
                </span>
              </div>

              {/* Total Orders */}
              <div style={{ background: '#ffffff', padding: 22, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Package size={18} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--dark)', display: 'block' }}>
                  {orders.length}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4, display: 'block' }}>
                  {pendingOrders} Pending Fulfillment
                </span>
              </div>

              {/* Total Products */}
              <div style={{ background: '#ffffff', padding: 22, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Catalog</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a21caf' }}>
                    <ShoppingBag size={18} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--dark)', display: 'block' }}>
                  {products.length}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 4, display: 'block' }}>
                  Across 4 Luxury Categories
                </span>
              </div>

              {/* Inquiries */}
              <div style={{ background: '#ffffff', padding: 22, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Client Inquiries</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <MessageSquare size={18} />
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--dark)', display: 'block' }}>
                  {inquiries.length}
                </span>
                <span style={{ fontSize: '0.72rem', color: unreadInquiries > 0 ? '#b91c1c' : '#15803d', fontWeight: 600, marginTop: 4, display: 'block' }}>
                  {unreadInquiries} Requiring Attention
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Feed */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }} className="admin-overview-grid">
              {/* Recent Orders */}
              <div style={{ background: '#ffffff', padding: 26, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark)' }}>
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{ background: 'none', border: 'none', color: 'var(--pink-pill)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View All Orders <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 14px',
                        borderRadius: 14,
                        background: '#faf8fa',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--dark)' }}>{ord.customerName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          {ord.id} · {ord.date}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 800, color: '#000000', fontSize: '0.92rem', display: 'block', fontFamily: 'var(--font-brand)' }}>
                          Rs. {Number(ord.total).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: ord.status === 'Delivered' ? '#15803d' : '#2563eb' }}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Management Shortcuts */}
              <div style={{ background: '#ffffff', padding: 26, borderRadius: 20, border: '1px solid var(--border-light)', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark)', marginBottom: 18 }}>
                  Quick Management
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => setActiveTab('products')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'var(--pink-soft)',
                      border: '1px solid var(--border-pink)',
                      color: 'var(--pink-pill)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>+ Add or Edit Products</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => setActiveTab('inquiries')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: '#faf8fa',
                      border: '1px solid var(--border-light)',
                      color: 'var(--dark)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Check Client Inquiries ({unreadInquiries})</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: '#faf8fa',
                      border: '1px solid var(--border-light)',
                      color: 'var(--dark)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Edit Homepage Banner &amp; Tagline</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'inquiries' && <AdminInquiries />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .admin-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-overview-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar { width: 80px !important; padding: 16px 8px !important; }
          .admin-sidebar span { display: none !important; }
          .admin-metrics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
