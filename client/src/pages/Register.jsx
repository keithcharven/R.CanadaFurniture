import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const pw = form.password;
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'var(--color-error)' };
    if (score <= 3) return { level: 2, label: 'Fair', color: 'var(--color-warning)' };
    return { level: 3, label: 'Strong', color: 'var(--color-success)' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register({ full_name: form.full_name, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="logo-r">R.</span>
              <span className="logo-canada">Canada</span>
            </Link>
            <h1>Create Account</h1>
            <p>Join us and start designing your dream home</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <FiUser className="input-icon" />
                <input type="text" name="full_name" value={form.full_name} onChange={handleChange} className="form-input" placeholder="Your full name" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
                <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" placeholder="your@email.com" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone (optional)</label>
              <div className="input-with-icon">
                <FiPhone className="input-icon" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+63 9XX XXX XXXX" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="form-input" placeholder="Min 6 characters" required />
                <button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className="strength-fill" style={{ width: `${strength.level * 33.3}%`, background: strength.color }} />
                  </div>
                  <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder="Re-enter password" required />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <FiCheck className="input-check" />
                )}
              </div>
            </div>

            <label className="auth-terms">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
              <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></span>
            </label>

            {error && <p className="form-error auth-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Welcome to the family</h2>
            <p>Create your account and unlock exclusive member benefits.</p>
            <div className="auth-side-features">
              <div className="auth-feature">✓ Track your orders</div>
              <div className="auth-feature">✓ Save your favorites</div>
              <div className="auth-feature">✓ Book design appointments</div>
              <div className="auth-feature">✓ Exclusive deals & early access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
