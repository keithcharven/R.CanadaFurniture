import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader" style={{ paddingTop: 'var(--navbar-height)' }}><div className="spinner" /></div>;

  if (!order) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Order not found</h2>
            <Link to="/shop" className="btn btn-primary">Go Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container" style={{ maxWidth: 680 }}>
        <div className="order-confirm card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <FiCheckCircle size={56} style={{ color: 'var(--color-success)', marginBottom: 'var(--space-md)' }} />
          <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-xs)' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--space-xl)' }}>
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          <div style={{ background: 'var(--color-gray-100)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Order Number</span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.order_number}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Total</span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-pink-700)' }}>
                  ₱{parseFloat(order.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--color-gray-600)' }}>
              <div>
                <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Status</span>
                <div><span className={`badge badge-${order.status}`}>{order.status}</span></div>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Payment</span>
                <div style={{ textTransform: 'capitalize' }}>{order.payment_method?.replace('_', ' ')}</div>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', fontSize: '0.8rem' }}>Date</span>
                <div>{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-gray-200)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', display: 'block', marginBottom: 'var(--space-sm)' }}>Items</span>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.35rem 0', color: 'var(--color-gray-600)' }}>
                    <span>{item.product?.name || 'Product'} × {item.quantity}</span>
                    <span>₱{parseFloat(item.unit_price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard/orders" className="btn btn-primary">
              <FiShoppingBag /> View My Orders
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Continue Shopping <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
