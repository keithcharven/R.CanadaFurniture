import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiBox, FiTag, FiShoppingBag, FiCalendar, FiUsers, FiMail, FiMessageSquare, FiLogOut, FiMenu, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const NAV_ITEMS = [
  { to: '/admin', icon: <FiGrid />, label: 'Overview', end: true },
  { to: '/admin/products', icon: <FiBox />, label: 'Products' },
  { to: '/admin/categories', icon: <FiTag />, label: 'Categories' },
  { to: '/admin/orders', icon: <FiShoppingBag />, label: 'Orders' },
  { to: '/admin/appointments', icon: <FiCalendar />, label: 'Appointments' },
  { to: '/admin/customers', icon: <FiUsers />, label: 'Customers' },

  { to: '/admin/contact-messages', icon: <FiMail />, label: 'Messages' },
  { to: '/admin/chat', icon: <FiMessageSquare />, label: 'Chat Inbox' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 1024);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 1024) setSidebarOpen(false);
  };

  return (
    <div className={`admin-page ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <span className="admin-logo-r">R.</span>
            <span className="admin-logo-text">Admin</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiChevronLeft />
          </button>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebarOnMobile}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.full_name?.charAt(0)}</div>
            <span>{user?.full_name}</span>
          </div>
          <button className="admin-nav-item logout" onClick={logout}>
            <FiLogOut /><span>Log Out</span>
          </button>
        </div>
      </aside>
      <main className="admin-content">
        {!sidebarOpen && (
          <button
            type="button"
            className="admin-sidebar-reopen"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
