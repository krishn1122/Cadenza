import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import './NonAdminView.scss';

const NonAdminView: React.FC = () => {
  return (
    <MainLayout activePage="home">
      <div className="non-admin-view">
        <div className="access-denied-container">
          <div className="access-denied-icon">
            <i className="bi bi-shield-lock"></i>
          </div>
          <h2>Access Restricted</h2>
          <p>
            You don't have permission to access the admin area.
            This section is only available for admin users.
          </p>
          <Link to="/dashboard" className="back-to-dashboard-btn">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NonAdminView;
