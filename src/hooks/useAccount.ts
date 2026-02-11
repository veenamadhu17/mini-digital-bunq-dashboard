import { useState, useEffect, useCallback } from 'react';
import { accountService } from '../services';
import type { Account } from '../types';

interface UseAccountReturn {
  account: Account | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAccount = (): UseAccountReturn => {
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await accountService.getAccount();
      setAccount(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch account');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccount,
  };
};