import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, User } from '../../services/auth';
import './SideNav.scss';

interface SideNavProps {
  activePage: 'home' | 'admin' | 'leads' | 'search';
}

const SideNav: React.FC<SideNavProps> = ({ activePage }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAdmin(user?.is_admin || false);
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  return (
    <nav className="side-nav">
      <div className="top-section">
        <div className="logo-container">
          <img src="/assets/images/image.png" alt="Cadenza Logo" className="logo" />
        </div>
        <div className="divider"></div>
        
        <div className="nav-items">
          <Link to="/dashboard" className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
            <div className={`nav-item-box ${activePage === 'home' ? 'active-box' : ''}`}>
              <span className="nav-icon">
                <i className="bi bi-grid"></i>
              </span>
              <span className="nav-label">Home</span>
            </div>
          </Link>
          
          {isAdmin && (
            <Link to="/admin" className={`nav-item ${activePage === 'admin' ? 'active' : ''}`}>
              <div className={`nav-item-box ${activePage === 'admin' ? 'active-box' : ''}`}>
                <span className="nav-icon">
                  <i className="bi bi-person"></i>
                </span>
                <span className="nav-label">Admin</span>
              </div>
            </Link>
          )}
          
          {isAdmin && (
            <Link to="/leads" className={`nav-item ${activePage === 'leads' ? 'active' : ''}`}>
              <span className="nav-icon">
                <i className="bi bi-bar-chart"></i>
              </span>
              <span className="nav-label">Leads</span>
            </Link>
          )}
          
          <Link to="/search" className={`nav-item ${activePage === 'search' ? 'active' : ''}`}>
            <div className={`nav-item-box ${activePage === 'search' ? 'active-box' : ''}`}>
              <span className="nav-icon">
                <i className="bi bi-search"></i>
              </span>
              <span className="nav-label">Search</span>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="bottom-section">
        <div className="nav-item" onClick={handleLogout}>
          <span className="nav-icon">
            <i className="bi bi-box-arrow-right"></i>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
