import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './LoginSuccessPage.scss';

const LoginSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('No authentication token received');
        }

        // Call the backend API to get user info
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/auth/login-success`, {
          params: { token }
        });

        // Save token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [navigate, location.search]);

  if (loading) {
    return (
      <div className="login-success-container">
        <div className="login-success-box">
          <h2>Signing you in...</h2>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-success-container">
        <div className="login-success-box">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginSuccessPage;
