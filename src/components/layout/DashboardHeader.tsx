import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../features/auth/AuthContext';
import { useTheme } from '../../hooks';
import './DashboardHeader.css';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-container">
        {/* Logo */}
        <Link to="/dashboard" className="header-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
            <path
              d="M16 18L24 26L32 18"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 26L24 34L32 26"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="header-title">vBank</span>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
          >
            Transactions
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="btn btn-ghost btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 10.5C16.6 14.8 12.9 18 8.5 18C4.4 18 1 14.6 1 10.5C1 6.1 4.2 2.4 8.5 2C8.2 2.6 8 3.3 8 4C8 6.8 10.2 9 13 9C13.7 9 14.4 8.8 15 8.5C16.3 9.4 17 10.9 17 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email text-sm text-tertiary">{user?.email}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};