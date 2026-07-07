import React, { useState } from 'react';
import { FiMapPin, FiMonitor, FiHome } from 'react-icons/fi';
import BookingModal from '../components/BookingModal';
import './DesignServices.css';

export default function DesignServices() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [meetingType, setMeetingType] = useState('in_store');

  const openBooking = (type) => {
    setMeetingType(type);
    setBookingOpen(true);
  };

  return (
    <div className="design-page">
      {/* Hero */}
      <section className="design-hero">
        <div className="design-hero-overlay" />
        <div className="design-hero-content container">
          <div className="design-hero-text animate-fade-in">
            <h1>The Design Desk</h1>
            <p>Any project, any budget, we're here to help — and it's <strong>100% free</strong>.</p>
            <button className="btn btn-primary btn-lg" onClick={() => openBooking('in_store')}>
              Book Your Free Appointment
            </button>
          </div>
        </div>
        {/* Floating preview card */}
        <div className="design-hero-preview animate-fade-in-up" onClick={() => openBooking('in_store')}>
          <span className="preview-label">Book Your Free Appointment</span>
          <span className="preview-sublabel">The Design Desk</span>
        </div>
      </section>

      {/* 3 Ways to Meet */}
      <section className="section design-ways-section">
        <div className="container">
          <div className="design-ways-panel">
            <div className="design-ways-header">
              <h2>3 Ways to Meet</h2>
              <p>Choose the meeting style that works best for you</p>
            </div>
            <div className="design-ways-grid">
              {/* In-Store */}
              <div className="design-way-card">
                <div className="design-way-icon">
                  <FiMapPin />
                </div>
                <h3>Meet In-Store</h3>
                <p>
                  Come to your nearest store to talk through your project with your design pro
                  and see furniture and houseware in person.
                </p>
                <button className="btn btn-primary" onClick={() => openBooking('in_store')}>
                  Meet In-Store
                </button>
              </div>

              <div className="design-way-divider" />

              {/* Online */}
              <div className="design-way-card">
                <div className="design-way-icon">
                  <FiMonitor />
                </div>
                <h3>Meet Online</h3>
                <p>
                  Hop on a video call with your design pro — they'll tour your space on-screen
                  and guide you through ideas & options.
                </p>
                <button className="btn btn-primary" onClick={() => openBooking('online')}>
                  Meet Online
                </button>
              </div>

              <div className="design-way-divider" />

              {/* At Home */}
              <div className="design-way-card">
                <div className="design-way-icon">
                  <FiHome />
                </div>
                <h3>Meet at Home</h3>
                <p>
                  Your designer comes to your home, gets to know you & your real-life space,
                  takes measurements & more.
                </p>
                <button className="btn btn-primary" onClick={() => openBooking('at_home')}>
                  Meet at Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section design-howit-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to your dream space</p>
          </div>
          <div className="design-steps">
            <div className="design-step">
              <div className="design-step-number">1</div>
              <h4>Book</h4>
              <p>Pick your preferred meeting style and schedule a time that works for you.</p>
            </div>
            <div className="design-step-connector" />
            <div className="design-step">
              <div className="design-step-number">2</div>
              <h4>Design</h4>
              <p>Meet your design pro. Share your vision, budget, and style preferences.</p>
            </div>
            <div className="design-step-connector" />
            <div className="design-step">
              <div className="design-step-number">3</div>
              <h4>Transform</h4>
              <p>Get a personalized plan with product recommendations tailored to your space.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-style section */}
      <section className="section design-faq-section">
        <div className="container">
          <div className="design-faq-grid">
            <div className="design-faq-left">
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about our free design service.</p>
            </div>
            <div className="design-faq-right">
              {[
                { q: 'Is this really free?', a: 'Yes! Our design consultation service is completely free with no hidden fees or obligations.' },
                { q: 'Do I need to buy anything?', a: 'Not at all. We\'re here to help you plan, whether you purchase from us or not.' },
                { q: 'How long does a session take?', a: 'Sessions typically last 30–60 minutes depending on your project scope.' },
                { q: 'Can I bring reference images?', a: 'Absolutely! Photos, Pinterest boards, magazine clippings — bring anything that inspires you.' },
              ].map((faq, i) => (
                <div key={i} className="design-faq-item">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedMeetingType={meetingType}
      />
    </div>
  );
}
