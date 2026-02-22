import React, { createContext, useContext, type ReactNode } from 'react';
import { useTransactions } from '../../hooks';
import type { Transaction, TransactionFilters, TransactionSort } from '../../types';

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
  sort: TransactionSort;
  setFilters: (filters: TransactionFilters) => void;
  setSort: (sort: TransactionSort) => void;
  refetch: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const transactionsData = useTransactions();

  return (
    <TransactionsContext.Provider value={transactionsData}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactionsContext must be used within a TransactionsProvider');
  }
  return context;
};