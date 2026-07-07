import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getImageUrl } from '../../utils/images';
import './Admin.css';

const MAX_IMAGES = 5;

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const blockOverlayClose = useRef(false);
  const [form, setForm] = useState({
    name: '', category_id: '', description: '', price: '', stock_quantity: '',
    material: '', dimensions: '', is_featured: false, images: []
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/products?limit=100'), api.get('/categories')]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const resetImageState = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setForm((prev) => ({ ...prev, images: [] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalCount = existingImages.length + form.images.length + files.length;
    if (totalCount > MAX_IMAGES) {
      toast.error(`You can only have up to ${MAX_IMAGES} images per product.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeForm = () => {
    if (blockOverlayClose.current) return;
    resetImageState();
    setShowForm(false);
    setEditing(null);
  };

  const removeExistingImage = async (imageId, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!editing?.id || imageId == null) {
      toast.error('Unable to delete this photo.');
      return;
    }

    const productId = editing.id;
    blockOverlayClose.current = true;

    const confirmed = window.confirm('Delete this photo?');
    window.setTimeout(() => { blockOverlayClose.current = false; }, 200);

    if (!confirmed) return;

    try {
      const { data } = await api.delete(`/products/${productId}/images/${imageId}`);
      setExistingImages(data.images || []);
      setEditing((prev) => (prev ? { ...prev, images: data.images || [] } : prev));
      toast.success('Photo deleted.');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete photo.');
    }
  };

  const openCreate = () => {
    setEditing(null);
    resetImageState();
    setExistingImages([]);
    setForm({
      name: '', category_id: '', description: '', price: '', stock_quantity: '',
      material: '', dimensions: '', is_featured: false, images: []
    });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    resetImageState();
    setExistingImages(p.images || []);
    setForm({
      name: p.name, category_id: p.category_id || '', description: p.description || '',
      price: p.price, stock_quantity: p.stock_quantity, material: p.material || '',
      dimensions: p.dimensions || '', is_featured: p.is_featured, images: []
    });
    setShowForm(true);
  };

  const handleUploadImages = async () => {
    if (!editing || form.images.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      form.images.forEach((file) => formData.append('images', file));
      const { data } = await api.post(`/products/${editing.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExistingImages(data.product.images || []);
      resetImageState();
      toast.success('Upload successfully');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasNewImages = form.images.length > 0;
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'images') {
          form.images.forEach((file) => formData.append('images', file));
        } else {
          formData.append(key, form[key]);
        }
      });

      if (editing) {
        await api.put(`/products/${editing.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (hasNewImages) {
          toast.success('Upload successfully');
        } else {
          toast.success('Product updated.');
        }
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (hasNewImages) {
          toast.success('Upload successfully');
        } else {
          toast.success('Product created.');
        }
      }
      closeForm();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted.');
      loadData();
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const totalImages = existingImages.length + form.images.length;
  const canAddMore = totalImages < MAX_IMAGES;

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Products</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><FiPlus /> Add Product</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal admin-form-modal" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="modal-close" onClick={closeForm}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input name="name" value={form.name} onChange={handleChange} className="form-input" required /></div>
                <div className="form-group"><label className="form-label">Category</label><select name="category_id" value={form.category_id} onChange={handleChange} className="form-select"><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Price</label><input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} className="form-input" required /></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Stock</label><input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} className="form-input" required /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="form-textarea" rows={3} /></div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Material</label><input name="material" value={form.material} onChange={handleChange} className="form-input" /></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Dimensions</label><input name="dimensions" value={form.dimensions} onChange={handleChange} className="form-input" /></div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} style={{ accentColor: 'var(--color-pink-500)' }} /> Featured product
                </label>

                <div className="form-group">
                  <label className="form-label">Product Images ({totalImages}/{MAX_IMAGES})</label>
                  {(existingImages.length > 0 || imagePreviews.length > 0) && (
                    <div className="image-preview-grid">
                      {existingImages.map((img) => (
                        <div key={img.id} className="image-preview-item">
                          <img src={getImageUrl(img.image_url)} alt="Product" />
                          {editing && (
                            <button
                              type="button"
                              className="image-preview-delete"
                              onClick={(e) => removeExistingImage(img.id, e)}
                              onMouseDown={(e) => e.stopPropagation()}
                              aria-label="Delete photo"
                              title="Delete photo"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      {imagePreviews.map((preview, i) => (
                        <div key={preview} className="image-preview-item new">
                          <img src={preview} alt={`New upload ${i + 1}`} />
                          <button type="button" className="image-preview-remove" onClick={() => removeNewImage(i)} aria-label="Remove image">
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {canAddMore && (
                    <label className="image-upload-zone">
                      <FiImage size={24} />
                      <span>Click to select images</span>
                      <span className="image-upload-hint">JPEG, PNG, GIF, WebP — max 5MB each</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageSelect}
                        hidden
                      />
                    </label>
                  )}
                  {editing && form.images.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ marginTop: 'var(--space-md)', width: '100%' }}
                      onClick={handleUploadImages}
                      disabled={uploading}
                    >
                      <FiUpload /> {uploading ? 'Uploading...' : 'Upload Images Now'}
                    </button>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  {editing ? 'Update' : 'Create'} Product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={getImageUrl(p.images?.[0]?.image_url, 'https://placehold.co/48x48/FFE4E9/FF7A9C?text=—')}
                    alt={p.name}
                    className="admin-product-thumb"
                  />
                </td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category?.name || '—'}</td>
                <td>₱{parseFloat(p.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>{p.stock_quantity}</td>
                <td>{p.is_featured ? '⭐' : '—'}</td>
                <td className="actions-cell">
                  <button className="action-btn" onClick={() => openEdit(p)}><FiEdit2 size={12} /></button>
                  <button className="action-btn danger" onClick={() => handleDelete(p.id)}><FiTrash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
