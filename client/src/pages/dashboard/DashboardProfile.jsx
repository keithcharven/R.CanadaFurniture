import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function DashboardProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const body = { full_name: form.full_name, phone: form.phone, address: form.address };
      if (form.newPassword) {
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }
      const { data } = await api.put('/auth/profile', body);
      updateUser(data.user);
      setSuccess('Profile updated successfully!');
      setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Profile Settings</h2>
      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={user?.email || ''} className="form-input" disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+63 9XX XXX XXXX" />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="form-textarea" placeholder="Your delivery address" rows={3} />
          </div>

          <h3 style={{ fontSize: '1.1rem', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>Change Password</h3>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-input" />
          </div>

          {error && <p className="form-error">{error}</p>}
          {success && <p style={{ color: 'var(--color-success)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
