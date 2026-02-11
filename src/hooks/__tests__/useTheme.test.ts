import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useTheme } from '../useTheme';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset document classes
    document.documentElement.className = '';
    // Reset matchMedia mock to default (light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    // Extra cleanup to ensure no state leaks
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should initialize with light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('should initialize with dark theme from system preference', () => {
    // Mock dark mode preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should toggle theme', async () => {
    const { result } = renderHook(() => useTheme());

    // Verify initial state
    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);

    // Toggle to dark
    await act(async () => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });
    expect(result.current.isDark).toBe(true);

    // Toggle back to light
    await act(async () => {
      result.current.toggleTheme();
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
    expect(result.current.isDark).toBe(false);
  });

  it('should set specific theme', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      result.current.setTheme('dark');
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('dark');
    });

    await act(async () => {
      result.current.setTheme('light');
    });

    await waitFor(() => {
      expect(result.current.theme).toBe('light');
    });
  });

  it('should persist theme to localStorage', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      result.current.setTheme('dark');
    });

    await waitFor(() => {
      expect(localStorage.getItem('vbank_theme')).toBe('dark');
    });
  });

  it('should load theme from localStorage', () => {
    localStorage.setItem('vbank_theme', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('should apply theme class to document', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      result.current.setTheme('dark');
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    await act(async () => {
      result.current.setTheme('light');
    });

    await waitFor(() => {
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  it('should prefer localStorage over system preference', () => {
    // Mock system prefers dark
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // But localStorage says light
    localStorage.setItem('vbank_theme', 'light');

    const { result } = renderHook(() => useTheme());

    // Should use localStorage value
    expect(result.current.theme).toBe('light');
  });
});