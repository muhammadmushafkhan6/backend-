import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Check, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';

const PRESET_IMAGES = [
  { label: 'Emerald Choker', url: '/assets/jewel_emerald_necklace.jpg' },
  { label: 'Pearl Chandelier Earrings', url: '/assets/jewel_pearl_earrings.jpg' },
  { label: 'Royal Polki Necklace', url: '/assets/jewel_polki_necklace.jpg' },
  { label: 'Art Deco Diamond Solitaire', url: '/assets/jewel_diamond_ring.jpg' },
  { label: 'Antique Kada Bangles', url: '/assets/jewel_gold_bangles.jpg' },
  { label: 'Sapphire Pearl Jhumkas', url: '/assets/jewel_sapphire_jhumkas.jpg' },
];

export default function AdminProducts({ onQuickPreview }) {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: '',
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    price: '',
    originalPrice: '',
    badge: '',
    tab: 'new-arrivals',
    images: ['/assets/jewel_emerald_necklace.jpg'],
    description: '',
    sizes: '',
    colors: '18K Gold',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [uploadingIndex, setUploadingIndex] = useState(null); // null, number (0-3), or 'new'
  const [uploadError, setUploadError] = useState('');
  const addFileInputRef = useRef(null);
  const replaceFileInputRef = useRef(null);
  const [targetReplaceIndex, setTargetReplaceIndex] = useState(0);

  // Upload or replace image
  const handleUploadFile = async (file, replaceIndex = null) => {
    if (!file) return;
    setUploadError('');
    setUploadingIndex(replaceIndex !== null ? replaceIndex : 'new');

    try {
      const result = await api.uploadImage(file);
      if (result && result.success && result.url) {
        setFormData((prev) => {
          const currentImages = [...(prev.images || [])];
          if (replaceIndex !== null && replaceIndex < currentImages.length) {
            // Replace existing image
            currentImages[replaceIndex] = result.url;
          } else if (currentImages.length < 4) {
            // Add new image (up to 4)
            currentImages.push(result.url);
          }
          return {
            ...prev,
            images: currentImages,
            image: currentImages[0] || result.url,
            hoverImage: currentImages[1] || currentImages[0] || result.url,
          };
        });
      } else {
        setUploadError(result?.error || 'Upload failed. Please try again.');
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Remove an image
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = (prev.images || []).filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || '',
        hoverImage: updated[1] || updated[0] || '',
      };
    });
  };

  // Set as Cover photo (move to index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const current = [...(prev.images || [])];
      const [item] = current.splice(index, 1);
      current.unshift(item);
      return {
        ...prev,
        images: current,
        image: current[0],
        hoverImage: current[1] || current[0],
      };
    });
  };

  // Add preset image
  const handleAddPreset = (url) => {
    setUploadError('');
    setFormData((prev) => {
      const current = [...(prev.images || [])];
      if (current.length < 4) {
        current.push(url);
      } else {
        current[0] = url; // replace 1st if full
      }
      return {
        ...prev,
        images: current,
        image: current[0],
        hoverImage: current[1] || current[0],
      };
    });
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const existingImages = Array.isArray(product.images) && product.images.length > 0
      ? [...product.images]
      : (product.image ? [product.image] : ['/assets/jewel_emerald_necklace.jpg']);

    setFormData({
      name: product.name,
      category: product.category || 'necklaces',
      categoryLabel: product.categoryLabel || 'Necklaces',
      price: product.price,
      originalPrice: product.originalPrice || '',
      badge: product.badge || '',
      tab: product.tab || 'new-arrivals',
      images: existingImages.slice(0, 4),
      image: existingImages[0] || product.image,
      hoverImage: existingImages[1] || existingImages[0] || product.hoverImage,
      description: product.description || '',
      sizes: product.sizes ? (Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes) : '',
      colors: product.colors ? (Array.isArray(product.colors) ? product.colors.join(', ') : product.colors) : '18K Gold',
    });
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanImages = (formData.images || []).filter(Boolean);
    if (cleanImages.length === 0) {
      setUploadError('Please upload at least 1 product image.');
      return;
    }

    const productPayload = {
      ...formData,
      images: cleanImages.slice(0, 4),
      image: cleanImages[0],
      hoverImage: cleanImages[1] || cleanImages[0],
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      sizes: typeof formData.sizes === 'string'
        ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.sizes,
      colors: typeof formData.colors === 'string'
        ? formData.colors.split(',').map((c) => c.trim()).filter(Boolean)
        : formData.colors,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
            Products &amp; Inventory
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage and publish products live to the Singhar storefront ({products.length} Total).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="pill-btn"
          style={{ padding: '10px 22px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Filter & Search Bar */}
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
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexGrow: 1, maxWidth: 360 }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search products by title or category..."
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

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'necklaces', label: 'Necklaces' },
            { id: 'earrings', label: 'Earrings' },
            { id: 'rings', label: 'Rings' },
            { id: 'bangles', label: 'Bangles & Cuffs' },
          ].map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
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
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
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
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRODUCT</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CATEGORY</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PRICE</th>
                <th style={{ padding: '14px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    {/* Product Info */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 12,
                            background: '#faf8fa',
                            border: '1px solid var(--border-light)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <img src={p.image} alt={p.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>
                            {p.name}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            ID: #{p.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--dark-sub)' }}>
                      {p.categoryLabel || p.category}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, color: '#601d1d', fontSize: '0.95rem' }}>
                        Rs. {Number(p.price).toLocaleString()}
                      </span>
                      {p.originalPrice && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textDecoration: 'line-through', marginLeft: 6 }}>
                          Rs. {Number(p.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleOpenEdit(p)}
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
                          <Edit2 size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          style={{
                            background: '#fff0f3',
                            border: '1px solid #ffd6df',
                            borderRadius: 8,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            color: '#d90429',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="modal-backdrop-light"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="modal-content-light"
              style={{
                maxWidth: 680,
                width: '100%',
                padding: 32,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#ffffff',
                borderRadius: 20,
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                position: 'relative',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--dark)' }}>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: '#faf8fa',
                    border: '1px solid var(--border-light)',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Product Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Emerald Choker Necklace"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Price & Product Color */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 2200"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--border-light)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                      Product Color *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="e.g. 18K Gold, Emerald Green, Silver"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--border-light)',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Product Sizes (Optional) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)' }}>
                      Sizes (Optional)
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Leave empty if not applicable (e.g. Earrings)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g. 2.4, 2.6, 2.8 or Standard, Adjustable"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Multi-Image Manager (Up to 4 Images) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)' }}>
                      Product Images ({formData.images?.length || 0}/4) *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      First image is the Main Cover
                    </span>
                  </div>

                  {/* Hidden inputs for adding and replacing */}
                  <input
                    ref={addFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file, null);
                      e.target.value = '';
                    }}
                  />
                  <input
                    ref={replaceFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file, targetReplaceIndex);
                      e.target.value = '';
                    }}
                  />

                  {/* Images Grid (Up to 4 slots) */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    {/* Existing Images */}
                    {(formData.images || []).map((imgUrl, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          borderRadius: 14,
                          border: index === 0 ? '2px solid var(--pink-pill)' : '1px solid var(--border-light)',
                          background: '#faf8fa',
                          height: 130,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                      >
                        {/* Cover Tag */}
                        {index === 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 6,
                              left: 6,
                              zIndex: 2,
                              background: 'var(--pink-pill)',
                              color: '#fff',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 9999,
                            }}
                          >
                            Main Cover
                          </div>
                        )}

                        {/* Image Preview */}
                        {uploadingIndex === index ? (
                          <Loader2
                            size={24}
                            color="var(--pink-pill)"
                            style={{ animation: 'spin 1s linear infinite' }}
                          />
                        ) : (
                          <img
                            src={imgUrl}
                            alt={`preview-${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                          />
                        )}

                        {/* Action Toolbar on Bottom */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            padding: '4px 6px',
                            borderTop: '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          {/* Change / Replace button */}
                          <button
                            type="button"
                            title="Replace this image"
                            onClick={() => {
                              setTargetReplaceIndex(index);
                              replaceFileInputRef.current?.click();
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--dark)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              padding: '2px 4px',
                            }}
                          >
                            <Edit2 size={12} /> Replace
                          </button>

                          {/* Set Cover button if not index 0 */}
                          {index !== 0 && (
                            <button
                              type="button"
                              title="Make this the Cover photo"
                              onClick={() => handleSetCover(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--pink-pill)',
                                cursor: 'pointer',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 4px',
                              }}
                            >
                              ★ Cover
                            </button>
                          )}

                          {/* Delete image button */}
                          <button
                            type="button"
                            title="Delete image"
                            onClick={() => handleRemoveImage(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#d90429',
                              cursor: 'pointer',
                              padding: '2px 4px',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Image Slot (if less than 4) */}
                    {(formData.images?.length || 0) < 4 && (
                      <div
                        onClick={() => uploadingIndex === null && addFileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer?.files?.[0];
                          if (file && file.type.startsWith('image/')) handleUploadFile(file, null);
                        }}
                        style={{
                          borderRadius: 14,
                          border: '2px dashed var(--pink-soft-border, #ffd6e0)',
                          background: uploadingIndex === 'new' ? '#fff0f5' : '#faf8fa',
                          height: 130,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: uploadingIndex === null ? 'pointer' : 'wait',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          padding: 10,
                        }}
                      >
                        {uploadingIndex === 'new' ? (
                          <Loader2
                            size={26}
                            color="var(--pink-pill)"
                            style={{ animation: 'spin 1s linear infinite' }}
                          />
                        ) : (
                          <>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                background: 'var(--pink-soft)',
                                color: 'var(--pink-pill)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 6,
                              }}
                            >
                              <Plus size={18} />
                            </div>
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--dark)' }}>
                              Add Photo
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              ({(formData.images?.length || 0) + 1}/4)
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Upload error */}
                  {uploadError && (
                    <p style={{ fontSize: '0.75rem', color: '#d90429', margin: '4px 0 8px', fontWeight: 600 }}>
                      ⚠ {uploadError}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the gemstone, finish, craftsmanship, and styling notes..."
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 12,
                      border: '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: 12,
                      background: '#faf8fa',
                      border: '1px solid var(--border-light)',
                      borderRadius: 9999,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pill-btn"
                    style={{ flex: 1, padding: 12, fontSize: '0.85rem' }}
                  >
                    <Check size={16} />
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
