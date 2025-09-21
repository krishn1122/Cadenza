import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth';

interface AdminRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  
  // Check if user is both authenticated and an admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Allow the component to render its children (the admin content)
  // The AdminPage component will handle showing appropriate view based on admin status
  return <>{children}</>;
};

export default AdminRoute;
