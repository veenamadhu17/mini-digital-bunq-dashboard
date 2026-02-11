import type { User, ApiResponse } from '../types';
import { MOCK_USER } from './mockData';

const AUTH_STORAGE_KEY = 'vbank_auth_token';
const MOCK_DELAY = 800; // Simulate network delay

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Mock login - accepts any email/password
   */
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(MOCK_DELAY);

    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Invalid credentials');
    }

    const token = `mock_token_${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, token);

    return {
      data: {
        user: MOCK_USER,
        token,
      },
      status: 200,
      message: 'Login successful',
    };
  },

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },

  /**
   * Get current user (from mock data)
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(500);

    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    return {
      data: MOCK_USER,
      status: 200,
    };
  },
};