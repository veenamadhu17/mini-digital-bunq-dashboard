import { useState, useEffect, useCallback, useMemo } from 'react';
import { transactionService } from '../services';
import type { Transaction, TransactionFilters, TransactionSort } from '../types';

interface UseTransactionsReturn {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
  sort: TransactionSort;
  setFilters: (filters: TransactionFilters) => void;
  setSort: (sort: TransactionSort) => void;
  refetch: () => Promise<void>;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [sort, setSort] = useState<TransactionSort>({
    field: 'date',
    direction: 'desc',
  });

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await transactionService.getTransactions(filters, sort);
      setTransactions(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    filters,
    sort,
    setFilters,
    setSort,
    refetch: fetchTransactions,
  };
};