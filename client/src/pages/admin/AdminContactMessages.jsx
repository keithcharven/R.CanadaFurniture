import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { loadData(); }, [statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/contact/admin${params}`);
      setMessages(data.messages || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/contact/admin/${id}`, { status }); loadData(); } catch(e) { alert('Failed'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Contact Messages</h2>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select" style={{ width: 'auto' }}>
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {messages.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.subject || '—'}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                <td>{new Date(m.created_at).toLocaleDateString()}</td>
                <td>
                  <select value={m.status} onChange={e => updateStatus(m.id, e.target.value)} className="form-select" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && <div className="admin-empty"><p>No messages.</p></div>}
      </div>
    </div>
  );
}
