import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.orders || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="dash-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <table className="dash-table">
          <thead>
            <tr><th>Order #</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.order_number}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                <td>₱{parseFloat(o.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td><span className={`badge badge-${o.payment_status === 'paid' ? 'delivered' : 'pending'}`}>{o.payment_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
