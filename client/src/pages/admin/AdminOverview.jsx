import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiCalendar, FiMail, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/overview').then(({ data }) => setData(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!data) return <p>Failed to load data.</p>;

  const { stats, recentOrders } = data;

  return (
    <div>
      <h2>Admin Overview</h2>
      <div className="admin-kpis">
        <div className="admin-kpi">
          <div className="admin-kpi-icon" style={{ background: '#D1FAE5', color: '#065F46' }}><FiDollarSign /></div>
          <h4>Total Sales</h4>
          <div className="kpi-value">₱{parseFloat(stats.totalSales || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi-icon" style={{ background: '#DBEAFE', color: '#1E40AF' }}><FiShoppingBag /></div>
          <h4>Total Orders</h4>
          <div className="kpi-value">{stats.totalOrders}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi-icon" style={{ background: 'var(--color-pink-100)', color: 'var(--color-pink-700)' }}><FiUsers /></div>
          <h4>Customers</h4>
          <div className="kpi-value">{stats.totalCustomers}</div>
        </div>
        <div className="admin-kpi">
          <div className="admin-kpi-icon" style={{ background: '#FEF3C7', color: '#92400E' }}><FiCalendar /></div>
          <h4>Pending Appointments</h4>
          <div className="kpi-value">{stats.pendingAppointments}</div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header"><h3>Recent Orders</h3></div>
        <table className="admin-table">
          <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {(recentOrders || []).map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.order_number}</td>
                <td>{o.user?.full_name || '—'}</td>
                <td>₱{parseFloat(o.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
