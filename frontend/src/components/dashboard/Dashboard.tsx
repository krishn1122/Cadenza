import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card bg-dark text-white">
            <div className="card-header">
              <h3>Dashboard</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">Welcome, {user?.name || 'User'}</h5>
              <p className="card-text">You have successfully logged in to the Cadenza platform!</p>
              <button
                className="btn btn-outline-light"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
