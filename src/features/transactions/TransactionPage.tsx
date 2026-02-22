import React from 'react';
import { TransactionsProvider } from './TransactionContext.tsx';
import { TransactionFilters } from './TransactionFilters.tsx';
import { TransactionList } from './TransactionList.tsx';
import './TransactionPage.css';

export const TransactionsPage: React.FC = () => {
  return (
    <TransactionsProvider>
      <div className="transactions-page">
        <div className="transactions-header">
          <h1>Transactions</h1>
          <p className="text-secondary">
            View and manage all your transactions
          </p>
        </div>

        <TransactionFilters />
        <TransactionList />
      </div>
    </TransactionsProvider>
  );
};