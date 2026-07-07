import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiHeart, FiChevronRight, FiPackage, FiTruck } from 'react-icons/fi';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/images';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setRelated(data.related || []);
      setSelectedImage(0);
      setQuantity(1);
    } catch (err) {
      console.error('Load product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product, quantity);
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setTimeout(() => setAdding(false), 800);
    }
  };

  if (loading) {
    return <div className="page-loader" style={{ paddingTop: 'var(--navbar-height)' }}><div className="spinner" /></div>;
  }

  if (!product) {
    return (
      <div className="product-not-found container">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => getImageUrl(img.image_url))
    : [getImageUrl(null)];

  const inStock = product.stock_quantity > 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight />
          <Link to="/shop">Shop</Link>
          <FiChevronRight />
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.id}`}>{product.category.name}</Link>
              <FiChevronRight />
            </>
          )}
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="product-main-image">
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`product-thumb ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            {product.category && (
              <Link to={`/shop?category=${product.category.id}`} className="product-info-category">
                {product.category.name}
              </Link>
            )}

            <h1>{product.name}</h1>

            <div className="product-price-block">
              <span className="product-detail-price">
                ₱{parseFloat(product.price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </span>
              <span className={`product-stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                <FiPackage />
                {inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.description && (
              <div className="product-description">
                <p>{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {(product.material || product.dimensions) && (
              <div className="product-specs">
                {product.material && (
                  <div className="spec-item">
                    <span className="spec-label">Material</span>
                    <span className="spec-value">{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="spec-item">
                    <span className="spec-label">Dimensions</span>
                    <span className="spec-value">{product.dimensions}</span>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!inStock}>
                  <FiMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} disabled={!inStock}>
                  <FiPlus />
                </button>
              </div>
              <button
                className={`btn btn-primary btn-lg product-add-to-cart ${adding ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                <FiShoppingCart />
                {adding ? 'Added to Cart!' : inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="btn btn-outline product-wishlist" aria-label="Wishlist">
                <FiHeart />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="product-shipping-info">
              <FiTruck />
              <span>Free delivery on orders over ₱5,000</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="section related-section">
            <div className="section-header">
              <h2>You May Also Like</h2>
            </div>
            <div className="grid grid-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
