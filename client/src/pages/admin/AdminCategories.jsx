import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { loadData(); }, []);
  const loadData = async () => { try { const { data } = await api.get('/categories'); setCategories(data.categories || []); } catch(e){} finally { setLoading(false); } };

  const openCreate = () => { setEditing(null); setForm({ name: '', description: '' }); setShowForm(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setShowForm(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { editing ? await api.put(`/categories/${editing.id}`, form) : await api.post('/categories', form); setShowForm(false); loadData(); } catch(err) { alert(err.response?.data?.error || 'Failed'); }
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; try { await api.delete(`/categories/${id}`); loadData(); } catch(e) { alert('Failed'); } };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Categories</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}><FiPlus /> Add Category</button>
      </div>
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal admin-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>{editing ? 'Edit' : 'Add'} Category</h3><button className="modal-close" onClick={() => setShowForm(false)}>×</button></div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-textarea" rows={3} /></div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editing ? 'Update' : 'Create'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.description || '—'}</td>
                <td className="actions-cell">
                  <button className="action-btn" onClick={() => openEdit(c)}><FiEdit2 size={12} /></button>
                  <button className="action-btn danger" onClick={() => handleDelete(c.id)}><FiTrash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
