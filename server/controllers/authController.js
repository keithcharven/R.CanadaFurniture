const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ full_name, email, phone, password_hash, role: 'customer' });

    const tokens = generateTokens(user);

    res.status(201).json({
      message: 'Registration successful.',
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, phone: user.phone },
      ...tokens
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const tokens = generateTokens(user);

    res.json({
      message: 'Login successful.',
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, phone: user.phone, address: user.address },
      ...tokens
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
};

exports.logout = async (req, res) => {
  // In a production app, you'd add the token to a blacklist
  res.json({ message: 'Logged out successfully.' });
};

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (full_name) user.full_name = full_name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' });
      }
      user.password_hash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({
      message: 'Profile updated.',
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, phone: user.phone, address: user.address }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};
