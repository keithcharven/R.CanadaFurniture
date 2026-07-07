import React, { useState } from 'react';
import { FiSend, FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import api from '../services/api';
import './Contact.css';

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100077560896828';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get in <span className="text-pink">Touch</span></h1>
          <p>We'd love to hear from you. Drop us a line and we'll get back to you shortly.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Form */}
            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              {success ? (
                <div className="contact-success animate-fade-in">
                  <div className="contact-success-icon">✉️</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-secondary" onClick={() => setSuccess(false)}>Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} className="form-input" placeholder="What's this about?" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} className="form-textarea" placeholder="Tell us more..." rows="6" required />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="contact-info">
              <div className="contact-info-card">
                <h3>Visit Our Showroom</h3>
                <div className="contact-info-item">
                  <FiMapPin className="contact-info-icon" />
                  <div>
                    <strong>R. Canada Furniture — Cebu</strong>
                    <p>Lapu-Lapu St, Poblacion, Argao, Cebu</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <FiPhone className="contact-info-icon" />
                  <div>
                    <strong>Phone</strong>
                    <p>+63 916 4530531</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <FiMail className="contact-info-icon" />
                  <div>
                    <strong>Email</strong>
                    <p>rolandcan1965@gmail.com</p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <FiClock className="contact-info-icon" />
                  <div>
                    <strong>Store Hours</strong>
                    <p>Mon–Sat: 10 AM – 8 PM</p>
                    <p>Sun: 11 AM – 6 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-socials-card">
                <h4>Follow Us</h4>
                <div className="contact-socials">
                  <a href="#" aria-label="Instagram"><FiInstagram /></a>
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook /></a>
                  <a href="#" aria-label="Twitter"><FiTwitter /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="contact-map">
        <div className="contact-map-placeholder">
          <FiMapPin size={32} />
          <p>Lapu-Lapu St, Poblacion, Argao, Cebu</p>
        </div>
      </section>
    </div>
  );
}
