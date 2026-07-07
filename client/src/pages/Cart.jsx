import React from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/images';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingBag size={48} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Start Shopping <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product || item;
              const imageUrl = getImageUrl(product.images?.[0]?.image_url, 'https://placehold.co/100x100/FFE4E9/FF7A9C?text=•');

              return (
                <div key={item.id || product.id} className="cart-item card">
                  <img src={imageUrl} alt={product.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <Link to={`/product/${product.id}`} className="cart-item-name">{product.name}</Link>
                    {product.material && <span className="cart-item-meta">{product.material}</span>}
                  </div>
                  <div className="cart-item-price">
                    ₱{parseFloat(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id || product.id, Math.max(1, item.quantity - 1))}>
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id || product.id, item.quantity + 1)}>
                      <FiPlus />
                    </button>
                  </div>
                  <div className="cart-item-subtotal">
                    ₱{(parseFloat(product.price) * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id || product.id)} aria-label="Remove">
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="cart-summary-row">
              <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span>₱{cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span>{cartTotal >= 5000 ? <span style={{ color: 'var(--color-success)' }}>Free</span> : '₱350.00'}</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-total-row">
              <strong>Total</strong>
              <strong>₱{(cartTotal + (cartTotal >= 5000 ? 0 : 350)).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</strong>
            </div>
            {cartTotal < 5000 && (
              <p className="cart-free-shipping-note">Add ₱{(5000 - cartTotal).toLocaleString('en-PH', { minimumFractionDigits: 2 })} more for free delivery!</p>
            )}
            <Link to={isAuthenticated ? '/checkout' : '/login'} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Link>
            <Link to="/shop" className="btn btn-ghost" style={{ width: '100%' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
