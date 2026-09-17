import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Trash2, CheckCircle2, Mail, Clock, Send } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminInquiries() {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const filteredInquiries = inquiries.filter((inq) => {
    return (
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.inquiryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
          Client Inquiries &amp; Commissions
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Messages and bespoke order inquiries received from the Singhar Concierge form ({inquiries.length} Total).
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: '#ffffff',
          padding: '14px 18px',
          borderRadius: 18,
          border: '1px solid var(--border-light)',
          maxWidth: 420,
          marginBottom: 24,
        }}
      >
        <Search size={18} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Search inquiries by client, email, or content..."
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

      {/* Inquiries Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filteredInquiries.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', background: '#ffffff', padding: 48, borderRadius: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
            No customer inquiries found.
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isUnread = inq.status === 'Unread';
            return (
              <motion.div
                key={inq.id}
                whileHover={{ y: -3 }}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: isUnread ? '1.5px solid var(--pink-pill)' : '1px solid var(--border-light)',
                  padding: 22,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 9999,
                          background: isUnread ? 'var(--pink-soft)' : '#f3f4f6',
                          color: isUnread ? 'var(--pink-pill)' : 'var(--text-muted)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        {inq.inquiryType}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dark)' }}>{inq.name}</h4>
                      <a
                        href={`mailto:${inq.email}`}
                        style={{ fontSize: '0.78rem', color: 'var(--pink-pill)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}
                      >
                        <Mail size={12} />
                        {inq.email}
                      </a>
                    </div>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {inq.date}
                    </span>
                  </div>

                  {/* Message Body */}
                  <p
                    style={{
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      color: 'var(--dark-sub)',
                      background: '#faf8fa',
                      padding: 12,
                      borderRadius: 12,
                      marginBottom: 16,
                    }}
                  >
                    "{inq.message}"
                  </p>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 14 }}>
                  <button
                    onClick={() => {
                      const nextStatus = inq.status === 'Unread' ? 'Replied' : 'Unread';
                      updateInquiryStatus(inq.id, nextStatus);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: inq.status === 'Replied' ? '#15803d' : 'var(--pink-pill)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Status: {inq.status} (Click to toggle)
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete inquiry from ${inq.name}?`)) {
                        deleteInquiry(inq.id);
                      }
                    }}
                    style={{
                      background: '#fff0f3',
                      border: '1px solid #ffd6df',
                      borderRadius: 8,
                      padding: '5px 8px',
                      cursor: 'pointer',
                      color: '#d90429',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
