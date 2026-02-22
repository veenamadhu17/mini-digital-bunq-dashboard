import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth hook
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo and Branding */}
        <div className="login-header">
          <div className="logo">
            <svg
              width="48"
              height="48"
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
          </div>
          <h1>vBank</h1>
          <p className="text-secondary">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error" role="alert">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10 6V10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
              </svg>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@vbank.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                minLength={6}
              />
              <button
                type="button"
                className="btn btn-ghost password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.26 11.6C2.91 11.08 2.91 10.42 3.26 9.9C4.7 7.6 7.14 5 10 5C12.86 5 15.3 7.6 16.74 9.9C17.09 10.42 17.09 11.08 16.74 11.6C15.3 13.9 12.86 16.5 10 16.5C7.14 16.5 4.7 13.9 3.26 11.6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="10" cy="10.75" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 3L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                      d="M3.26 11.6C2.91 11.08 2.91 10.42 3.26 9.9C4.7 7.6 7.14 5 10 5C12.86 5 15.3 7.6 16.74 9.9C17.09 10.42 17.09 11.08 16.74 11.6C15.3 13.9 12.86 16.5 10 16.5C7.14 16.5 4.7 13.9 3.26 11.6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="10" cy="10.75" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
            <p className="hint text-tertiary text-sm">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <p className="text-sm text-tertiary">Demo credentials:</p>
          <p className="text-sm">
            <strong>Email:</strong> demo@vbank.com
          </p>
          <p className="text-sm">
            <strong>Password:</strong> password123
          </p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="text-xs text-tertiary">
            This is a prototype application for demonstration purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};