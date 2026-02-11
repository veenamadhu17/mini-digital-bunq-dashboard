import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnalytics } from '../useAnalytics';
import { analyticsService } from '../../services';
import type { SpendingInsights } from '../../types';

vi.mock('../../services', () => ({
  analyticsService: {
    getSpendingInsights: vi.fn(),
  },
}));

describe('useAnalytics', () => {
  const mockInsights: SpendingInsights = {
    totalIncome: 5000,
    totalExpenses: 3000,
    netBalance: 2000,
    byCategory: [],
    monthlyTrend: [],
    topExpenseCategory: 'GROCERIES',
    averageTransactionAmount: 150,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch insights on mount', async () => {
    vi.mocked(analyticsService.getSpendingInsights).mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useAnalytics());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.insights).toEqual(mockInsights);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(analyticsService.getSpendingInsights).mockRejectedValue(
      new Error('Failed to fetch insights')
    );

    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.insights).toBeNull();
    expect(result.current.error).toBe('Failed to fetch insights');
  });

  it('should refetch insights when refetch is called', async () => {
    vi.mocked(analyticsService.getSpendingInsights).mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useAnalytics());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const updatedInsights = { ...mockInsights, totalIncome: 6000 };
    vi.mocked(analyticsService.getSpendingInsights).mockResolvedValue(updatedInsights);

    await waitFor(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.insights?.totalIncome).toBe(6000);
    });
  });
});