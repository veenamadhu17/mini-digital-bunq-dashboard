import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../authService';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllTimers();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await authService.login('test@vbank.com', 'password123');
      
      expect(response.status).toBe(200);
      expect(response.data.user).toBeDefined();
      expect(response.data.user.email).toBe('demo@bunq.com'); // Mock user
      expect(response.data.token).toBeDefined();
      expect(localStorage.getItem('bunq_auth_token')).toBeTruthy();
    });

    it('should reject login with empty email', async () => {
      await expect(authService.login('', 'password123')).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should reject login with empty password', async () => {
      await expect(authService.login('test@vbank.com', '')).rejects.toThrow(
        'Email and password are required'
      );
    });

    it('should reject login with short password', async () => {
      await expect(authService.login('test@vbank.com', '12345')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should store auth token in localStorage', async () => {
      await authService.login('test@vbank.com', 'password123');
      const token = localStorage.getItem('bunq_auth_token');
      expect(token).toBeTruthy();
      expect(token).toContain('mock_token_');
    });
  });

  describe('logout', () => {
    it('should clear auth token from localStorage', async () => {
      // Login first
      await authService.login('test@vbank.com', 'password123');
      expect(localStorage.getItem('bunq_auth_token')).toBeTruthy();

      // Logout
      await authService.logout();
      expect(localStorage.getItem('bunq_auth_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not logged in', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true when logged in', async () => {
      await authService.login('test@vbank.com', 'password123');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false after logout', async () => {
      await authService.login('test@vbank.com', 'password123');
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      await authService.login('test@vbank.com', 'password123');
      const response = await authService.getCurrentUser();
      
      expect(response.status).toBe(200);
      expect(response.data.email).toBe('demo@bunq.com');
      expect(response.data.name).toBeDefined();
    });

    it('should throw error when not authenticated', async () => {
      await expect(authService.getCurrentUser()).rejects.toThrow('Not authenticated');
    });
  });
});