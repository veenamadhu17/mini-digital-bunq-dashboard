import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p className="text-secondary">
        Welcome to your vBank dashboard. This is where your account overview will appear.
      </p>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)', marginTop: 'var(--spacing-xl)' }}>
        <div className="card skeleton" style={{ height: '200px' }}></div>
        <div className="card skeleton" style={{ height: '200px' }}></div>
        <div className="card skeleton" style={{ height: '200px' }}></div>
      </div>
    </div>
  );
};