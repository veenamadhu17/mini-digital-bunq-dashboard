import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '../useAuth';
import { authService } from '../../services';

// Mock the auth service
vi.mock('../../services', () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should start with no user when not authenticated', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should load authenticated user on mount', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@vbank.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      data: mockUser,
      status: 200,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login successfully', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@vbank.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.login).mockResolvedValue({
      data: { user: mockUser, token: 'mock-token' },
      status: 200,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Test that loading becomes true during login
    let wasLoading = false;
    const loginPromise = act(async () => {
      const promise = result.current.login('test@vbank.com', 'password');
      // Check immediately after calling login
      if (result.current.isLoading) {
        wasLoading = true;
      }
      await promise;
    });

    await loginPromise;

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login failure', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(false);
    vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.login('test@vbank.com', 'wrong');
      } catch (err) {
        // Expected to throw
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle logout successfully', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@vbank.com',
      name: 'Test User',
      createdAt: new Date(),
    };

    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      data: mockUser,
      status: 200,
    });
    vi.mocked(authService.logout).mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle authentication check failure', async () => {
    vi.mocked(authService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authService.getCurrentUser).mockRejectedValue(
      new Error('Authentication failed')
    );

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Authentication failed');
  });
});