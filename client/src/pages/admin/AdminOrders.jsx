import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { loadOrders(); }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await api.get(`/orders/admin/all${params}`);
      setOrders(data.orders || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try { await api.put(`/orders/admin/${id}`, { status }); loadOrders(); } catch(e) { alert('Failed'); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 'var(--space-xl)' }}>
        <h2 style={{ marginBottom: 0 }}>Orders</h2>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-select" style={{ width: 'auto' }}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.order_number}</td>
                <td>{o.user?.full_name || '—'}</td>
                <td>{o.items?.length || 0}</td>
                <td>₱{parseFloat(o.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td><span className={`badge badge-${o.payment_status === 'paid' ? 'delivered' : 'pending'}`}>{o.payment_status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="form-select" style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="admin-empty"><p>No orders found.</p></div>}
      </div>
    </div>
  );
}
