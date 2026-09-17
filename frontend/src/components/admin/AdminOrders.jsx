import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Search, Eye, Trash2, X, CheckCircle, Clock, Truck, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const STATUS_COLORS = {
  Pending: { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' },
  Processing: { bg: '#eff6ff', text: '#1d4ed8', border: '#dbeafe' },
  Shipped: { bg: '#fdf4ff', text: '#a21caf', border: '#fae8ff' },
  Delivered: { bg: '#f0fdf4', text: '#15803d', border: '#dcfce7' },
  Cancelled: { bg: '#fef2f2', text: '#b91c1c', border: '#fee2e2' },
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
          Customer Orders
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Track, fulfill, and update live orders placed on Singhar store ({orders.length} Total).
        </p>
      </div>

      {/* Filter / Search Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          backgroundColor: '#ffffff',
          padding: '14px 18px',
          borderRadius: 18,
          border: '1px solid var(--border-light)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexGrow: 1, maxWidth: 360 }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by Order ID, customer, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.86rem',
              color: 'var(--dark)',
              background: 'none',
            }}
          />
        </div>

        {/* Status Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 9999,
                  border: active ? '1px solid var(--pink-pill)' : '1px solid var(--border-light)',
                  background: active ? 'var(--pink-pill)' : '#faf8fa',
                  color: active ? '#ffffff' : 'var(--dark)',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#faf8fa', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ORDER ID</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CUSTOMER</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ITEMS</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const style = STATUS_COLORS[ord.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      {/* ID & Date */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'block', fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)', fontFamily: 'var(--font-ui)' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {ord.date}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: 'var(--dark)' }}>
                          {ord.customerName}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {ord.customerEmail}
                        </span>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {ord.items && ord.items.slice(0, 3).map((item, i) => (
                            <img
                              key={i}
                              src={item.image}
                              alt={item.name}
                              title={`${item.name} x${item.quantity}`}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                objectFit: 'contain',
                                background: '#faf8fa',
                                border: '1px solid var(--border-light)',
                              }}
                            />
                          ))}
                          <span style={{ fontSize: '0.8rem', color: 'var(--dark-sub)', fontWeight: 600 }}>
                            {ord.items ? ord.items.reduce((s, it) => s + it.quantity, 0) : 1} pcs
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 800, color: '#000000', fontSize: '0.95rem' }}>
                          Rs. {Number(ord.total).toLocaleString()}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td style={{ padding: '14px 18px' }}>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 9999,
                            background: style.bg,
                            color: style.text,
                            border: `1px solid ${style.border}`,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            style={{
                              background: '#faf8fa',
                              border: '1px solid var(--border-light)',
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: 'var(--dark)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            <Eye size={13} />
                            Details
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete order ${ord.id}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            style={{
                              background: '#fff0f3',
                              border: '1px solid #ffd6df',
                              borderRadius: 8,
                              padding: '6px 8px',
                              cursor: 'pointer',
                              color: '#d90429',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div
            className="modal-backdrop-light"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="modal-content-light"
              style={{
                maxWidth: 560,
                width: '100%',
                padding: 32,
                background: '#ffffff',
                borderRadius: 20,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--dark)' }}>
                    Order Summary #{selectedOrder.id}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date: {selectedOrder.date}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#faf8fa',
                    border: '1px solid var(--border-light)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Customer Info Card */}
              <div style={{ background: '#faf8fa', padding: 16, borderRadius: 14, border: '1px solid var(--border-light)', marginBottom: 20 }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--pink-pill)', textTransform: 'uppercase', marginBottom: 4 }}>
                  Shipping &amp; Client Details
                </span>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark)' }}>{selectedOrder.customerName}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedOrder.customerEmail} · {selectedOrder.customerPhone || 'N/A'}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Address: {selectedOrder.address || 'Standard Delivery'}</p>
              </div>

              {/* Items List */}
              <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 220, overflowY: 'auto' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Ordered Items ({selectedOrder.items?.length || 0})
                </span>
                {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={it.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: '#faf8fa' }} />
                      <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)' }}>{it.name}</p>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Qty: {it.quantity} {it.selectedSize ? `· Size: ${it.selectedSize}` : ''}</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-brand)', fontWeight: 800, color: '#000000' }}>Rs. {Number(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Total & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border-light)' }}>
                <div>
                  {selectedOrder.discount > 0 && (
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'block', marginBottom: 2 }}>
                      🏷️ Offer: {selectedOrder.promoCode || 'PROMO'} (-Rs. {Number(selectedOrder.discount).toLocaleString()})
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Grand Total</span>
                  <span style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--dark)' }}>Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="pill-btn"
                  style={{ padding: '8px 22px', fontSize: '0.85rem' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
