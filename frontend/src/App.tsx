import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import LoginSuccessPage from './components/auth/LoginSuccessPage';
import AdminRoute from './components/auth/AdminRoute';
import HomePage from './components/dashboard/HomePage';
import LeadsPage from './components/dashboard/LeadsPage';
import SearchPage from './components/search/SearchPage';
import PersonDetailsPage from './components/search/PersonDetailsPage';
import CompanyDetailsPage from './components/search/CompanyDetailsPage';
import AdminPage from './components/admin/AdminPage';
import BlogManagementPage from './components/admin/BlogManagementPage';
import { authService } from './services/auth';

// Protected route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login-success" element={<LoginSuccessPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
      <Route path="/blog-management" element={
        <AdminRoute>
          <BlogManagementPage />
        </AdminRoute>
      } />
      <Route path="/leads" element={
        <AdminRoute>
          <LeadsPage />
        </AdminRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />
      <Route path="/person/:id" element={
        <ProtectedRoute>
          <PersonDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/company/:id" element={
        <ProtectedRoute>
          <CompanyDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
