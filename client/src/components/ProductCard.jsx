import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/images';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(false);

  const imageUrl = getImageUrl(product.images?.[0]?.image_url);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    try {
      await addToCart(product, 1);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setTimeout(() => setAdding(false), 600);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(!wishlisted);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-card-image">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        <button
          className={`product-wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <FiHeart />
        </button>
        {product.is_featured && <span className="product-badge">Featured</span>}
      </div>
      <div className="product-card-body">
        {product.category && (
          <span className="product-category">{product.category.name}</span>
        )}
        <h4 className="product-name">{product.name}</h4>
        <div className="product-card-footer">
          <span className="product-price">₱{parseFloat(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
          <button
            className={`product-add-btn ${adding ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
            <span>{product.stock_quantity <= 0 ? 'Sold Out' : adding ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
