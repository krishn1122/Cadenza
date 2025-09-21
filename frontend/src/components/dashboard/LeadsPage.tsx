import React from 'react';
import MainLayout from '../layout/MainLayout';
import { authService } from '../../services/auth';
import NonAdminView from '../admin/NonAdminView';
import './LeadsPage.scss';

const LeadsPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.is_admin || false;

  // If user is not an admin, show access denied view
  if (!isAdmin) {
    return <NonAdminView />;
  }

  return (
    <MainLayout activePage="leads">
      <div className="leads-page">
        <div className="leads-header">
          <h1 className="leads-title">Leads Management</h1>
          <p className="leads-subtitle">Track and manage leads in one place</p>
        </div>

        <div className="leads-content">
          <div className="leads-card">
            <h3>Lead Analytics</h3>
            <p>This section will display lead analytics and statistics.</p>
          </div>

          <div className="leads-card">
            <h3>Recent Leads</h3>
            <p>This section will show recently added leads.</p>
          </div>

          <div className="leads-card">
            <h3>Lead Conversion</h3>
            <p>This section will show lead conversion rates.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LeadsPage;
