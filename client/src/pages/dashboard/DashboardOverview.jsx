import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiCalendar, FiArrowRight } from 'react-icons/fi';
import api from '../../services/api';

export default function DashboardOverview() {
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, apptRes] = await Promise.all([
        api.get('/orders'),
        api.get('/appointments/my'),
      ]);
      setOrders(ordersRes.data.orders?.slice(0, 3) || []);
      setAppointments(apptRes.data.appointments?.slice(0, 3) || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <h2>Dashboard Overview</h2>

      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: 'var(--color-pink-100)', color: 'var(--color-pink-500)' }}>
            <FiShoppingBag />
          </div>
          <h4>Total Orders</h4>
          <span className="dash-value">{orders.length}</span>
        </div>
        <div className="dash-card">
          <div className="dash-card-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
            <FiCalendar />
          </div>
          <h4>Appointments</h4>
          <span className="dash-value">{appointments.length}</span>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Orders</h3>
          <Link to="/dashboard/orders" className="btn btn-ghost btn-sm">View All <FiArrowRight /></Link>
        </div>
        {orders.length === 0 ? (
          <div className="dash-empty"><p>No orders yet.</p><Link to="/shop" className="btn btn-primary btn-sm">Start Shopping</Link></div>
        ) : (
          <table className="dash-table">
            <thead><tr><th>Order #</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.order_number}</td>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>₱{parseFloat(o.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Appointments */}
      <div>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Appointments</h3>
          <Link to="/dashboard/appointments" className="btn btn-ghost btn-sm">View All <FiArrowRight /></Link>
        </div>
        {appointments.length === 0 ? (
          <div className="dash-empty"><p>No appointments yet.</p><Link to="/design-services" className="btn btn-primary btn-sm">Book Free Consultation</Link></div>
        ) : (
          <table className="dash-table">
            <thead><tr><th>Date</th><th>Type</th><th>Project</th><th>Status</th></tr></thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.preferred_date || 'TBD'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{a.meeting_type?.replace('_', ' ')}</td>
                  <td>{a.project_type}</td>
                  <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
