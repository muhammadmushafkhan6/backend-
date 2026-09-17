import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCcw, Check, KeyRound, Shield, AlertCircle, Loader2, Tag, Sparkles, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function AdminSettings() {
  const { settings, updateHeroSettings, updateAboutSettings, updateOfferSettings, resetAllData, changeAdminPassword, adminUser } = useStore();
  const [heroForm, setHeroForm] = useState({
    announcement: settings.hero?.announcement || '',
    tagline: settings.hero?.tagline || '',
    ctaText: settings.hero?.ctaText || 'Learn more',
  });

  const [offerForm, setOfferForm] = useState({
    enabled: settings.offer?.enabled ?? false,
    badgeText: settings.offer?.badgeText || 'SPECIAL OFFER',
    title: settings.offer?.title || 'Special 15% Off on Royal Heirlooms',
    code: settings.offer?.code || 'SINGHAR15',
    discountType: settings.offer?.discountType || 'percent',
    discountValue: settings.offer?.discountValue ?? 15,
    minOrderAmount: settings.offer?.minOrderAmount ?? 0,
  });

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    await updateOfferSettings({
      ...offerForm,
      code: (offerForm.code || '').trim().toUpperCase(),
      discountValue: Number(offerForm.discountValue || 0),
      minOrderAmount: Number(offerForm.minOrderAmount || 0),
    });
    setSavedMessage('Promotional offer settings updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res && res.success) {
        setPasswordSuccess('Administrator password updated successfully in database!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      } else {
        setPasswordError(res?.error || 'Failed to update password. Please check your current password.');
      }
    } catch {
      setPasswordError('Error connecting to authentication server.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const [aboutForm, setAboutForm] = useState({
    title: settings.about?.title || 'About us',
    paragraph1: settings.about?.paragraphs?.[0] || '',
    paragraph2: settings.about?.paragraphs?.[1] || '',
    buttonText: settings.about?.buttonText || 'More about us',
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveHero = (e) => {
    e.preventDefault();
    updateHeroSettings(heroForm);
    setSavedMessage('Hero content updated successfully!');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  const handleSaveAbout = (e) => {
    e.preventDefault();
    updateAboutSettings({
      title: aboutForm.title,
      paragraphs: [aboutForm.paragraph1, aboutForm.paragraph2],
      buttonText: aboutForm.buttonText,
    });
    setSavedMessage('About editorial updated successfully!');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
          Storefront Content Settings
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Update hero headlines, promotional banners, and editorial storytelling displayed on the storefront.
        </p>
      </div>

      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#15803d',
            padding: '12px 18px',
            borderRadius: 12,
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Check size={16} />
          {savedMessage}
        </motion.div>
      )}

      {/* Hero Settings Box */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          padding: 28,
          marginBottom: 28,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark)', marginBottom: 18 }}>
          Homepage Hero &amp; Announcement
        </h3>
        <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={heroForm.announcement}
              onChange={(e) => setHeroForm({ ...heroForm, announcement: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-light)',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
              Hero Statement Tagline (Bottom Right of Hero)
            </label>
            <input
              type="text"
              value={heroForm.tagline}
              onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-light)',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
              Hero CTA Button Text
            </label>
            <input
              type="text"
              value={heroForm.ctaText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-light)',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <button type="submit" className="pill-btn" style={{ padding: '9px 20px', fontSize: '0.82rem' }}>
              <Save size={14} />
              Save Hero Settings
            </button>
          </div>
        </form>
      </div>

      {/* Promotional Offer & Discount Code Settings */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: offerForm.enabled ? '2px solid #000000' : '1px solid var(--border-light)',
          padding: 28,
          marginBottom: 28,
          boxShadow: offerForm.enabled ? '0 8px 30px rgba(0, 0, 0, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Tag size={18} />
              <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--dark)' }}>
                Promotional Offer &amp; Discount Voucher
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Configure live storewide sales, coupon codes, and discount campaigns that clients can apply at checkout.
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setOfferForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              borderRadius: 9999,
              background: offerForm.enabled ? '#0a0a0a' : '#f0f0f0',
              color: offerForm.enabled ? '#ffffff' : '#555555',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              transition: 'all 0.2s',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: offerForm.enabled ? '#4ade80' : '#aaaaaa',
                boxShadow: offerForm.enabled ? '0 0 8px #4ade80' : 'none',
              }}
            />
            {offerForm.enabled ? 'OFFER ACTIVE' : 'OFFER DISABLED'}
          </button>
        </div>

        <form onSubmit={handleSaveOffer} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: Title & Badge */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Offer Headline / Announcement Text *
              </label>
              <input
                type="text"
                required
                value={offerForm.title}
                onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                placeholder="e.g. Special 15% Off on Entire Royal Collection"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Offer Tag
              </label>
              <input
                type="text"
                value={offerForm.badgeText}
                onChange={(e) => setOfferForm({ ...offerForm, badgeText: e.target.value })}
                placeholder="e.g. EID SPECIAL"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 2: Promo Code, Type, Value, Min Order */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Promo Coupon Code *
              </label>
              <input
                type="text"
                required
                value={offerForm.code}
                onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                placeholder="e.g. SINGHAR15"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  outline: 'none',
                  textTransform: 'uppercase',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Discount Type
              </label>
              <select
                value={offerForm.discountType}
                onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                  background: '#ffffff',
                }}
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PKR)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Discount Value {offerForm.discountType === 'percent' ? '(%)' : '(Rs.)'} *
              </label>
              <input
                type="number"
                required
                min="1"
                max={offerForm.discountType === 'percent' ? 100 : 100000}
                value={offerForm.discountValue}
                onChange={(e) => setOfferForm({ ...offerForm, discountValue: e.target.value })}
                placeholder={offerForm.discountType === 'percent' ? '15' : '500'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Min Order (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={offerForm.minOrderAmount}
                onChange={(e) => setOfferForm({ ...offerForm, minOrderAmount: e.target.value })}
                placeholder="0 = No minimum"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            style={{
              background: '#fafafa',
              borderRadius: 12,
              border: '1px dashed #d1d1d1',
              padding: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 2 }}>
                Live Client Preview
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: '#000000',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: 3,
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  {offerForm.badgeText || 'SPECIAL OFFER'}
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#111111' }}>
                  {offerForm.title || 'Special Promotional Offer'}
                </span>
              </div>
              <p style={{ fontSize: '0.74rem', color: '#555555', marginTop: 4 }}>
                Use code <strong style={{ color: '#000000' }}>{offerForm.code || 'CODE'}</strong> at checkout for {offerForm.discountType === 'percent' ? `${offerForm.discountValue}% OFF` : `Rs. ${offerForm.discountValue} OFF`}
                {Number(offerForm.minOrderAmount) > 0 ? ` on orders over Rs. ${Number(offerForm.minOrderAmount).toLocaleString()}` : ''}.
              </p>
            </div>

            <div
              style={{
                background: offerForm.enabled ? '#ecfdf5' : '#f3f4f6',
                border: offerForm.enabled ? '1px solid #a7f3d0' : '1px solid #e5e7eb',
                color: offerForm.enabled ? '#047857' : '#6b7280',
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
              }}
            >
              {offerForm.enabled ? '✓ Visible on Storefront & Checkout' : '○ Disabled (Not visible)'}
            </div>
          </div>

          <div>
            <button type="submit" className="pill-btn" style={{ padding: '9px 20px', fontSize: '0.82rem' }}>
              <Save size={14} />
              Save Offer Settings
            </button>
          </div>
        </form>
      </div>

      {/* About Section Settings */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          padding: 28,
          marginBottom: 28,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark)', marginBottom: 18 }}>
          About &amp; Editorial Narrative
        </h3>
        <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
              Leading Paragraph (Bold)
            </label>
            <textarea
              rows={2}
              value={aboutForm.paragraph1}
              onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-light)',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
              Body Narrative (Description)
            </label>
            <textarea
              rows={3}
              value={aboutForm.paragraph2}
              onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border-light)',
                fontSize: '0.86rem',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div>
            <button type="submit" className="pill-btn" style={{ padding: '9px 20px', fontSize: '0.82rem' }}>
              <Save size={14} />
              Save Editorial Settings
            </button>
          </div>
        </form>
      </div>

      {/* Security & Administrator Credentials */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid var(--border-light)',
          padding: 28,
          marginBottom: 28,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark)',
            }}
          >
            <Shield size={18} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dark)' }}>
            Security &amp; Admin Credentials
          </h3>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Manage your administrator access credentials. Passwords are encrypted with salted cryptographic hashing and stored securely in the database.
        </p>

        {passwordSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 18,
            }}
          >
            <Check size={16} />
            <span>{passwordSuccess}</span>
          </motion.div>
        )}

        {passwordError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 18,
            }}
          >
            <AlertCircle size={16} />
            <span>{passwordError}</span>
          </motion.div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                New Password *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-light)',
                  fontSize: '0.86rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
            <button
              type="submit"
              disabled={passwordLoading}
              className="pill-btn"
              style={{
                padding: '9px 22px',
                fontSize: '0.82rem',
                opacity: passwordLoading ? 0.7 : 1,
                cursor: passwordLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {passwordLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <KeyRound size={14} />
                  <span>Update Password</span>
                </>
              )}
            </button>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Session: {adminUser?.username || 'admin'}
            </span>
          </div>
        </form>
      </div>

      {/* Danger Zone: Reset Data */}
      <div
        style={{
          background: '#fff5f7',
          borderRadius: 20,
          border: '1px solid #ffd6df',
          padding: 24,
        }}
      >
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b91c1c', marginBottom: 6 }}>
          Reset Demo Data
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#7f1d1d', marginBottom: 14 }}>
          Reset all products, sample orders, and inquiries back to the original Singhar store defaults.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset all products and orders to initial demo state?')) {
              resetAllData();
              alert('All data has been reset to defaults.');
            }
          }}
          style={{
            background: '#ffffff',
            border: '1px solid #f87171',
            color: '#b91c1c',
            padding: '8px 18px',
            borderRadius: 9999,
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <RefreshCcw size={14} />
          Reset All Store Data
        </button>
      </div>
    </div>
  );
}
