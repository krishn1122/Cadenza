import React, { useState, useEffect } from 'react';
import './Header.scss';
import { authService } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("/assets/images/avatar.png");
  
  // Preload and cache the profile picture
  useEffect(() => {
    if (user?.profile_picture) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(user.profile_picture || "/assets/images/avatar.png");
        setImageLoaded(true);
      };
      img.onerror = () => {
        // If profile picture fails to load, use initial letter placeholder
        setImageSrc('/assets/images/users_img/u1.png');
        setImageLoaded(true);
      };
      img.src = user.profile_picture;
    }
  }, [user?.profile_picture]);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-brand">
        <h1>CADENZA</h1>
      </div>
      <div className="header-profile">
        <div className="profile-dropdown" onClick={toggleDropdown}>
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src={imageSrc} 
                alt="Profile Avatar" 
                style={{ opacity: imageLoaded ? 1 : 0.7 }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/images/users_img/u1.png';
                  setImageLoaded(true);
                }}
              />
            </div>
            <div className="profile-name">
              <span className="user-name">{user?.name || 'Andrew J.'}</span>
              <span className="profile-email">{user?.email || 'email@gmail.co'}</span>
            </div>
            <span className="dropdown-toggle">
              <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
            </span>
          </div>
          {dropdownOpen && (
            <div className="profile-dropdown-menu">
              <ul>
                <li onClick={() => navigate('/profile')}>Profile</li>
                <li onClick={() => navigate('/settings')}>Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
