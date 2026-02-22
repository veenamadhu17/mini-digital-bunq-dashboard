import React from 'react';
import { AccountOverview } from './AccountOverview';
import { QuickStats } from './QuickStats';
import { RecentActivity } from './RecentActivity';
import './DashboardPage.css'

export const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <h1>Dashboard</h1>
        <p className="text-secondary">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <AccountOverview />
      <QuickStats />
      <RecentActivity />
    </div>
  );
};