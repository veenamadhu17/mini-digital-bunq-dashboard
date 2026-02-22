import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from './DashboardHeader.tsx';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <DashboardHeader />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};