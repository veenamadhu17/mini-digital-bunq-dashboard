import React from 'react';
import { useAccount } from '../../hooks';
import { formatCurrency, formatIBAN } from '../../utils/format';
import './AccountOverview.css';

export const AccountOverview: React.FC = () => {
  const { account, isLoading, error } = useAccount();

  if (isLoading) {
    return (
      <div className="account-overview">
        <div className="account-card skeleton" style={{ height: '200px' }}></div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="account-overview">
        <div className="card">
          <p className="text-error">Failed to load account information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-overview">
      <div className="account-card">
        {/* Card Header */}
        <div className="account-card-header">
          <div className="account-type">
            <span className="account-type-badge">{account.accountType}</span>
            <span className="account-number text-sm text-tertiary">
              {formatIBAN(account.accountNumber)}
            </span>
          </div>
          
          <div className="account-logo">
            <svg
              width="40"
              height="40"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="12" fill="white" fillOpacity="0.1" />
              <path
                d="M16 18L24 26L32 18"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 26L24 34L32 26"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Balance */}
        <div className="account-balance">
          <span className="balance-label">Available Balance</span>
          <h2 className="balance-amount">
            {formatCurrency(account.balance, account.currency)}
          </h2>
        </div>

        {/* Card Footer */}
        <div className="account-card-footer">
          <div className="card-chip"></div>
          <span className="card-network">vBank</span>
        </div>
      </div>
    </div>
  );
};