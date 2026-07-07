import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: <FiGrid />, label: 'Overview', end: true },
  { to: '/dashboard/orders', icon: <FiShoppingBag />, label: 'My Orders' },
  { to: '/dashboard/appointments', icon: <FiCalendar />, label: 'My Appointments' },
  { to: '/dashboard/profile', icon: <FiUser />, label: 'Profile' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="dashboard-user">
              <div className="dashboard-avatar">{user?.full_name?.charAt(0) || 'U'}</div>
              <div>
                <strong>{user?.full_name}</strong>
                <span>{user?.email}</span>
              </div>
            </div>
            <nav className="dashboard-nav">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `dashboard-nav-item ${isActive ? 'active' : ''}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button className="dashboard-nav-item logout" onClick={logout}>
                <FiLogOut />
                <span>Log Out</span>
              </button>
            </nav>
          </aside>
          <main className="dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
