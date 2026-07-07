import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTarget, FiStar, FiUsers, FiArrowRight } from 'react-icons/fi';
import './About.css';

const VALUES = [
  { icon: <FiHeart />, title: 'Quality Craftsmanship', desc: 'Every piece is built to last, using premium materials and time-honored techniques.' },
  { icon: <FiTarget />, title: 'Thoughtful Design', desc: 'We believe great design is accessible. Our pieces blend beauty with everyday function.' },
  { icon: <FiStar />, title: 'Customer First', desc: 'From free design services to seamless delivery, your experience matters most.' },
  { icon: <FiUsers />, title: 'Community Driven', desc: 'We support local artisans and sustainable practices in every collection.' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content animate-fade-in">
            <span className="hero-badge">Our Story</span>
            <h1>Making Homes <span className="text-pink">Beautiful</span> Since 2015</h1>
            <p>
              R. Canada Furniture was born from a simple belief: everyone deserves a beautiful home.
              We curate modern, quality furniture that transforms spaces into sanctuaries.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section about-story-section">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-image">
              <div className="about-story-placeholder">
                <span>🏡</span>
              </div>
            </div>
            <div className="about-story-text">
              <h2>From a Small Workshop to Your Dream Home</h2>
              <p>
                What started as a passion project in a small workshop has grown into one of the Philippines'
                most loved furniture brands. Our founder believed that great design shouldn't come with an
                intimidating price tag.
              </p>
              <p>
                Today, we work with talented craftspeople and designers to bring you pieces that are
                modern, durable, and — most importantly — make you smile every time you walk into your room.
              </p>
              <p>
                Whether you're furnishing your first apartment or redesigning your family home, we're here
                with free design help, quality furniture, and the kind of service that feels personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section about-values-section">
        <div className="container">
          <div className="section-header">
            <h2>What We Stand For</h2>
            <p>The principles that guide everything we do</p>
          </div>
          <div className="grid grid-4 about-values-grid">
            {VALUES.map((val, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-icon">{val.icon}</div>
                <h4>{val.title}</h4>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Ready to transform your space?</h2>
            <p>Explore our collection or book a free design consultation today.</p>
            <div className="about-cta-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">Shop Now <FiArrowRight /></Link>
              <Link to="/design-services" className="btn btn-secondary btn-lg">Free Design Help</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
