import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    shipping_address: user?.address || '',
    city: '',
    postal_code: '',
    payment_method: 'cod',
    notes: '',
  });

  const deliveryFee = cartTotal >= 5000 ? 0 : 350;
  const total = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/orders', {
        shipping_address: `${form.shipping_address}, ${form.city} ${form.postal_code}`,
        payment_method: form.payment_method,
        notes: form.notes,
      });
      clearCart();
      navigate(`/order-confirmation/${data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <Link to="/shop" className="btn btn-primary">Go Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" className="checkout-back"><FiArrowLeft /> Back to Cart</Link>
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping */}
            <div className="checkout-section">
              <h3><FiTruck /> Shipping Address</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" value={user?.full_name || ''} className="form-input" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} className="form-textarea" rows={2} placeholder="Street address, barangay, etc." required />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} className="form-input" placeholder="City" required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Postal Code</label>
                  <input type="text" name="postal_code" value={form.postal_code} onChange={handleChange} className="form-input" placeholder="Postal code" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <h3><FiCreditCard /> Payment Method</h3>
              <div className="checkout-payment-options">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Transfer to our bank account' },
                  { value: 'online', label: 'GCash / Online', desc: 'Pay via GCash or online payment' },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option ${form.payment_method === opt.value ? 'active' : ''}`}>
                    <input type="radio" name="payment_method" value={opt.value} checked={form.payment_method === opt.value} onChange={handleChange} />
                    <div>
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="checkout-section">
              <div className="form-group">
                <label className="form-label">Order Notes (optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="form-textarea" rows={2} placeholder="Special instructions for delivery..." />
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-lg checkout-submit" disabled={loading}>
              {loading ? 'Placing Order...' : `Place Order — ₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
            </button>
          </form>

          {/* Order Review */}
          <div className="checkout-review card">
            <h3>Order Review</h3>
            <div className="checkout-items">
              {cartItems.map((item) => {
                const product = item.product || item;
                return (
                  <div key={item.id || product.id} className="checkout-item">
                    <span className="checkout-item-name">{product.name} <small>× {item.quantity}</small></span>
                    <span>₱{(parseFloat(product.price) * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₱{cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : `₱${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-total-row">
              <strong>Total</strong>
              <strong>₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
