import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useTransactionsContext } from './TransactionContext';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import './TransactionList.css';

export const TransactionList: React.FC = () => {
  const { transactions, isLoading } = useTransactionsContext();

  // Calculate dynamic height based on window size
  const listHeight = useMemo(() => {
    return Math.min(window.innerHeight - 400, 600);
  }, []);

  const getCategoryIcon = (category: string): React.ReactElement => {
    const icons: Record<string, React.ReactElement> = {
      GROCERIES: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 2L7 7M15 2L17 7M7 7H17L19 22H5L7 7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      TRANSPORT: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="11" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
          <path d="M3 11V8C3 6.89543 3.89543 6 5 6H19C20.1046 6 21 6.89543 21 8V11" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      ENTERTAINMENT: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="7" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 2V7M17 2V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      UTILITIES: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
      SALARY: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      RENT: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z" stroke="currentColor" strokeWidth="2" />
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      SHOPPING: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2L3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" />
          <path d="M3 6H21M16 10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      HEALTHCARE: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      OTHER: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="6" r="2" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <circle cx="12" cy="18" r="2" fill="currentColor" />
        </svg>
      ),
    };

    return icons[category] || icons.OTHER;
  };

  const renderTransaction = (_index: number, transaction: Transaction) => {
    return (
      <div className="transaction-row-wrapper">
        <div className="transaction-row">
          <div
            className={`transaction-icon ${
              transaction.type === 'INCOMING' ? 'transaction-icon-income' : 'transaction-icon-expense'
            }`}
          >
            {getCategoryIcon(transaction.category)}
          </div>

          <div className="transaction-details">
            <div className="transaction-main-info">
              <span className="transaction-counterparty">{transaction.counterpartyName}</span>
              <span className="transaction-category-badge">
                {transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase()}
              </span>
            </div>
            <span className="transaction-description text-sm text-tertiary">
              {transaction.description}
            </span>
          </div>

          <div className="transaction-meta">
            <span
              className={`transaction-amount ${
                transaction.type === 'INCOMING' ? 'text-success' : 'text-error'
              }`}
            >
              {transaction.type === 'INCOMING' ? '+' : '-'}
              {formatCurrency(transaction.amount, transaction.currency)}
            </span>
            <span className="transaction-date text-sm text-tertiary">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="transaction-list-container">
        <div className="transaction-list-skeleton">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton" style={{ height: '72px', marginBottom: 'var(--spacing-sm)' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <div className="empty-state-large">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2L9 6M15 2L15 6M3 10L21 10M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h3>No transactions found</h3>
          <p className="text-secondary">
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list-container">
      <div className="transaction-list-header">
        <span className="transaction-count">
          {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
        </span>
      </div>

      <div className="transaction-list" style={{ height: `${listHeight}px` }}>
        <Virtuoso
          data={transactions}
          itemContent={renderTransaction}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};