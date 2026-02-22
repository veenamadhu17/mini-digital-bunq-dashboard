import React from 'react';
import { useAnalytics } from '../../hooks';
import { formatCurrency } from '../../utils/format';
import './QuickStats.css';

export const QuickStats: React.FC = () => {
  const { insights, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="quick-stats">
        <div className="stat-card skeleton" style={{ height: '140px' }}></div>
        <div className="stat-card skeleton" style={{ height: '140px' }}></div>
        <div className="stat-card skeleton" style={{ height: '140px' }}></div>
      </div>
    );
  }

  if (error || !insights) {
    return null;
  }

  const stats = [
    {
      id: 'income',
      label: 'Total Income',
      value: formatCurrency(insights.totalIncome),
      change: '+12.5%',
      trend: 'up' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4L12 20M12 4L18 10M12 4L6 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: 'success',
    },
    {
      id: 'expenses',
      label: 'Total Expenses',
      value: formatCurrency(insights.totalExpenses),
      change: '+8.2%',
      trend: 'down' as const,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 20L12 4M12 20L6 14M12 20L18 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: 'error',
    },
    {
      id: 'net',
      label: 'Net Balance',
      value: formatCurrency(insights.netBalance),
      change: insights.netBalance > 0 ? 'Positive' : 'Negative',
      trend: insights.netBalance > 0 ? ('up' as const) : ('down' as const),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 12H21M3 6H21M3 18H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      color: insights.netBalance > 0 ? 'success' : 'error',
    },
  ];

  return (
    <div className="quick-stats">
      {stats.map((stat) => (
        <div key={stat.id} className={`stat-card stat-card-${stat.color}`}>
          <div className="stat-header">
            <div className={`stat-icon stat-icon-${stat.color}`}>{stat.icon}</div>
            <span className={`stat-change stat-change-${stat.trend}`}>
              {stat.trend === 'up' ? '↗' : '↘'} {stat.change}
            </span>
          </div>

          <div className="stat-content">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};