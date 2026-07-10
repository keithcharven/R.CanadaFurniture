import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeart, FiHome } from 'react-icons/fi';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import BookingModal from '../components/BookingModal';
import './Landing.css';

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuredRes, newestRes, catRes] = await Promise.all([
        api.get('/products?featured=true&limit=4'),
        api.get('/products?sort=newest&limit=8'),
        api.get('/categories'),
      ]);
      setFeatured(featuredRes.data.products || []);
      setNewest(newestRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Load landing data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const CATEGORY_ICONS = {
    'Living Room': '🛋️',
    'Bedroom': '🛏️',
    'Dining': '🍽️',
    'Office': '💼',
    'Decor': '🪴',
  };

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-text animate-fade-in">
            <span className="hero-badge">New Season Collection</span>
            <h1>Modern Home,<br /><span className="text-pink">Beautifully Made</span></h1>
            <p>Discover furniture that blends timeless design with everyday comfort. Curated pieces for every room, every style, every budget.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/design-services" className="btn btn-secondary btn-lg">
                Free Design Help
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item">
              <FiTruck />
              <span>Fast Delivery</span>
            </div>
            <div className="trust-item">
              <FiHome />
              <span>Space Planning Assistance</span>
            </div>
            <div className="trust-item">
              <FiStar />
              <span>Premium Quality</span>
            </div>
            <div className="trust-item">
              <FiHeart />
              <span>Free Design Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Room</h2>
            <p>Find the perfect pieces for every space in your home</p>
          </div>
          <div className="category-grid">
            {categories.slice(0, 5).map((cat, i) => (
              <Link to={`/shop?category=${cat.id}`} key={cat.id} className="category-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="category-icon">{CATEGORY_ICONS[cat.name] || '🏠'}</div>
                <h4>{cat.name}</h4>
                <span className="category-explore">Explore <FiArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <p>Fresh designs just landed in our collection</p>
          </div>
          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : (
            <div className="grid grid-4">
              {newest.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="section-cta">
            <Link to="/shop?sort=newest" className="btn btn-secondary">
              View All New Arrivals <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers / Featured */}
      {featured.length > 0 && (
        <section className="section bestsellers-section">
          <div className="container">
            <div className="section-header">
              <h2>Best Sellers</h2>
              <p>Our most-loved pieces chosen by you</p>
            </div>
            <div className="grid grid-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Design Services Promo */}
      <section className="design-promo-section">
        <div className="container">
          <div className="design-promo-card">
            <div className="design-promo-content">
              <span className="design-promo-badge">100% Free</span>
              <h2>Not sure where to start?</h2>
              <p>
                Our expert designers will help you plan your dream space — in store, online, or at your home.
                No cost, no commitment, just great design.
              </p>
              <div className="design-promo-actions">
                <button className="btn btn-primary btn-lg" onClick={() => setBookingOpen(true)}>
                  Book Free Consultation
                </button>
                <Link to="/design-services" className="btn btn-ghost">
                  Learn More <FiArrowRight />
                </Link>
              </div>
            </div>
            <div className="design-promo-visual">
              <div className="promo-circle promo-circle-1" />
              <div className="promo-circle promo-circle-2" />
              <div className="promo-icon">🎨</div>
            </div>
          </div>
        </div>
      </section>

      {/* More Arrivals */}
      {newest.length > 4 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>More to Discover</h2>
              <p>Keep exploring our latest additions</p>
            </div>
            <div className="grid grid-4">
              {newest.slice(4, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/shop" className="btn btn-primary btn-lg">
                Browse Full Catalog <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
