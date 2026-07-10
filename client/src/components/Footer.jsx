import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100077560896828';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-r">R.</span>
              <span className="logo-canada">Canada</span>
              <span className="logo-furniture">Furniture MFG</span>
            </Link>
            <p className="footer-tagline">
              Modern home, beautifully made. Premium furniture and design services
              that transform your space into something extraordinary.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop</h4>
            <ul>
              <li><Link to="/shop?sort=newest">New Arrivals</Link></li>
              <li><Link to="/shop">All Furniture</Link></li>
              <li><Link to="/shop?category=1">Living Room</Link></li>
              <li><Link to="/shop?category=2">Bedroom</Link></li>
              <li><Link to="/shop?category=3">Dining</Link></li>
              <li><Link to="/shop?category=4">Office</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/design-services">Free Design Services</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Visit Us</h4>
            <ul className="footer-contact-list">
              <li>
                <FiMapPin className="footer-contact-icon" />
                <span>Lapu-Lapu St, Poblacion, Argao, Cebu</span>
              </li>
              <li>
                <FiPhone className="footer-contact-icon" />
                <span>+63 916 4530531</span>
              </li>
              <li>
                <FiMail className="footer-contact-icon" />
                <span>rolandcan1965@gmail.com</span>
              </li>
            </ul>
            <div className="footer-hours">
              <strong>Store Hours</strong>
              <p>Mon-Sat: 8:00 AM - 8:00 PM</p>
              <p>Sun: 10:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-text">
              <h4>Stay in the loop</h4>
              <p>Get the latest on new arrivals, sales, and design tips.</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="btn btn-primary newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2020 R. Canada Furniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
