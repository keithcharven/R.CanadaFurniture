import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/shop?sort=newest', label: 'New Arrivals' },
    { to: '/shop', label: 'Furniture' },
    { to: '/shop?category=5', label: 'Decor' },
    { to: '/design-services', label: 'Free Design Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-r">R.</span>
          <span className="logo-canada">Canada</span>
          <span className="logo-furniture">Furniture MFG</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={location.pathname === link.to.split('?')[0] ? 'active' : ''}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Search */}
          <button className="navbar-icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <FiSearch />
          </button>

          {/* User */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper">
              <button className="navbar-icon-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="Account menu">
                <FiUser />
                <FiChevronDown size={12} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown animate-slide-down">
                  <div className="user-dropdown-header">
                    <span className="user-name">{user?.full_name}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <div className="user-dropdown-divider" />
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="user-dropdown-item">
                    {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                  <Link to="/dashboard/orders" className="user-dropdown-item">My Orders</Link>
                  <div className="user-dropdown-divider" />
                  <button className="user-dropdown-item logout-btn" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-icon-btn" aria-label="Sign in">
              <FiUser />
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="navbar-icon-btn cart-btn" aria-label="Cart">
            <FiShoppingCart />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {/* Mobile Toggle */}
          <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="search-bar animate-slide-down">
          <form onSubmit={handleSearch} className="container">
            <div className="search-bar-inner">
              <FiSearch />
              <input
                type="text"
                placeholder="Search furniture, decor, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>
                <FiX />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu animate-slide-down">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li className="mobile-divider" />
            {isAuthenticated ? (
              <>
                <li><Link to={isAdmin ? '/admin' : '/dashboard'}>{isAdmin ? 'Admin Dashboard' : 'Dashboard'}</Link></li>
                <li><button onClick={handleLogout} className="mobile-logout">Log Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
