import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });

    // Value should still be initial immediately
    expect(result.current).toBe('initial');

    // After delay, value should update
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 600 }
    );
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'first' },
      }
    );

    rerender({ value: 'second' });
    rerender({ value: 'third' });

    // Only the last value should be set after delay
    await waitFor(
      () => {
        expect(result.current).toBe('third');
      },
      { timeout: 400 }
    );
  });
});