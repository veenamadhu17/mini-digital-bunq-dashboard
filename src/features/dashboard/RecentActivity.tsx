import React from 'react';
import { useTransactions } from '../../hooks';
import { formatCurrency, getRelativeTime } from '../../utils/format';
import './RecentActivity.css';

export const RecentActivity: React.FC = () => {
  const { transactions, isLoading } = useTransactions();

  // Get the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="activity-item skeleton" style={{ height: '72px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="empty-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
            <circle cx="7" cy="14" r="1" fill="currentColor" />
          </svg>
          <p className="text-secondary">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <a href="/transactions" className="view-all-link">
          View all
        </a>
      </div>

      <div className="activity-list">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="activity-item">
            <div
              className={`activity-icon activity-icon-${
                transaction.type === 'INCOMING' ? 'income' : 'expense'
              }`}
            >
              {transaction.type === 'INCOMING' ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L12 20M12 4L18 10M12 4L6 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 20L12 4M12 20L6 14M12 20L18 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>

            <div className="activity-details">
              <div className="activity-info">
                <span className="activity-counterparty">{transaction.counterpartyName}</span>
                <span className="activity-description text-sm text-tertiary">
                  {transaction.description}
                </span>
              </div>

              <div className="activity-meta">
                <span
                  className={`activity-amount ${
                    transaction.type === 'INCOMING' ? 'text-success' : 'text-error'
                  }`}
                >
                  {transaction.type === 'INCOMING' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </span>
                <span className="activity-time text-xs text-tertiary">
                  {getRelativeTime(transaction.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};