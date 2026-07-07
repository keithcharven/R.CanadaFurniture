import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './BookingModal.css';

const PROJECT_TYPES = [
  'Living Room',
  'Bedroom',
  'Dining Room',
  'Full Home',
  'Office',
  'Kitchen',
  'Outdoor Space',
  'Other'
];

const COUNTRY_CODES = [
  { code: '+63', label: 'Philippines (+63)' },
  { code: '+1', label: 'USA/Canada (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+65', label: 'Singapore (+65)' },
];

export default function BookingModal({ isOpen, onClose, preselectedMeetingType = 'in_store' }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    client_full_name: '',
    email: '',
    country_code: '+63',
    contact_number: '',
    preferred_date: '',
    preferred_time: '',

    project_type: '',
    meeting_type: preselectedMeetingType,
    consent_given: false,
  });

  useEffect(() => {
    if (isOpen) {

      setForm((prev) => ({
        ...prev,
        meeting_type: preselectedMeetingType,
        client_full_name: user?.full_name || '',
        email: user?.email || '',
      }));
      setSuccess(false);
      setError('');
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, preselectedMeetingType]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/appointments', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-modal modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Book Your Free Appointment</h3>
            <p className="booking-modal-subtitle">at a store near you</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="booking-success animate-fade-in">
              <div className="booking-success-icon">🎉</div>
              <h3>Appointment Booked!</h3>
              <p>We've received your booking request. Our design team will contact you shortly to confirm the details.</p>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Meeting Type */}
              <div className="booking-meeting-types">
                {[
                  { value: 'in_store', label: 'In-Store', icon: '🏬' },
                  { value: 'online', label: 'Online', icon: '💻' },
                  { value: 'at_home', label: 'At Home', icon: '🏠' },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`meeting-type-option ${form.meeting_type === type.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="meeting_type"
                      value={type.value}
                      checked={form.meeting_type === type.value}
                      onChange={handleChange}
                    />
                    <span className="meeting-type-icon">{type.icon}</span>
                    <span className="meeting-type-label">{type.label}</span>
                  </label>
                ))}
              </div>

              {/* Name */}
              <div className="form-group">
                <label className="form-label"><FiUser className="form-icon" /> Full Name</label>
                <input
                  type="text"
                  name="client_full_name"
                  value={form.client_full_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label"><FiMail className="form-icon" /> Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label"><FiPhone className="form-icon" /> Contact Number</label>
                <div className="booking-phone-row">
                  <select
                    name="country_code"
                    value={form.country_code}
                    onChange={handleChange}
                    className="form-select booking-country-select"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="contact_number"
                    value={form.contact_number}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="9XX XXX XXXX"
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="booking-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label"><FiCalendar className="form-icon" /> Preferred Date</label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={form.preferred_date}
                    onChange={handleChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label"><FiClock className="form-icon" /> Preferred Time</label>
                  <input
                    type="time"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>



              {/* Project Type */}
              <div className="form-group">
                <label className="form-label">Project Type</label>
                <select
                  name="project_type"
                  value={form.project_type}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select project type</option>
                  {PROJECT_TYPES.map((pt) => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
              </div>

              {/* Consent */}
              <label className="booking-consent">
                <input
                  type="checkbox"
                  name="consent_given"
                  checked={form.consent_given}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to be contacted by R. Canada Furniture regarding this appointment and
                  consent to the processing of my personal information as described in the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                </span>
              </label>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Submitting...' : 'Book Appointment'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
