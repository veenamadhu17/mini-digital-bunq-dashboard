import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services';
import type { SpendingInsights } from '../types';

interface UseAnalyticsReturn {
  insights: SpendingInsights | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [insights, setInsights] = useState<SpendingInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyticsService.getSpendingInsights();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insights');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
};