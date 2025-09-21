import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { authService } from '../../services/auth';
import { userService, User } from '../../services/user';
import NonAdminView from './NonAdminView';
import './AdminPage.scss';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  
  useEffect(() => {
    // Check if current user is admin
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.is_admin) {
      setIsCurrentUserAdmin(false);
    } else {
      setIsCurrentUserAdmin(true);
      fetchUsers(currentPage);
    }
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      const response = await userService.getUsers(page);
      setUsers(response.users);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleBack = () => {
    navigate('/blog-management');
  };
  
  const toggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      await userService.updateAdminStatus(userId, !currentAdminStatus);
      
      // Update the local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentAdminStatus } 
          : user
      ));
    } catch (err) {
      console.error('Error updating admin status:', err);
      setError('Failed to update admin status. Please try again.');
    }
  };
  
  const handleEdit = () => {
    console.log('Edit mode enabled');
    // In a real app, this would toggle edit mode
  };
  
  if (!isCurrentUserAdmin) {
    return <NonAdminView />;
  }
  
  return (
    <MainLayout activePage="admin">
      <div className="admin-page">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBack}>
            <i className="bi bi-arrow-left"></i> Edit Cadenza Blog Posts
          </button>
        </div>
        
        <div className="admin-header">
          <div className="admin-title-section">
            <h1 className="admin-title">Users</h1>
            <p className="admin-subtitle">View and manage all users in one place</p>
          </div>
          
          <button className="edit-button" onClick={handleEdit}>
            <i className="bi bi-pencil"></i> Edit
          </button>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading users...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Is Cadenza</th>
                  <th>Is Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td className={user.is_cadenza ? 'true-cell' : 'false-cell'}>
                      {user.is_cadenza ? 'True' : 'False'}
                    </td>
                    <td className={user.is_admin ? 'true-cell' : 'false-cell'}>
                      {user.is_admin ? 'True' : 'False'}
                    </td>
                    <td>
                      <button 
                        className="admin-toggle-btn"
                        onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !error && users.length > 0 && (
          <div className="pagination">
            <button 
              className="page-nav prev" 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            
            {totalPages <= 5 ? (
              // If 5 or fewer pages, show all page numbers
              Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  className={`page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))
            ) : (
              // If more than 5 pages, show pagination with ellipsis
              <>
                {/* First page */}
                <button 
                  className={`page-number ${currentPage === 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                
                {/* Ellipsis or second page */}
                {currentPage > 3 && (
                  <button className="page-number dots" disabled>
                    ...
                  </button>
                )}
                
                {/* Pages around current page */}
                {Array.from(
                  { length: Math.min(3, totalPages - 2) },
                  (_, i) => {
                    let pageNum;
                    if (currentPage <= 2) pageNum = i + 2;
                    else if (currentPage >= totalPages - 1) pageNum = totalPages - 3 + i;
                    else pageNum = currentPage - 1 + i;
                    
                    return (
                      <button 
                        key={pageNum}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                
                {/* Ellipsis or second-to-last page */}
                {currentPage < totalPages - 2 && (
                  <button className="page-number dots" disabled>
                    ...
                  </button>
                )}
                
                {/* Last page */}
                <button 
                  className={`page-number ${currentPage === totalPages ? 'active' : ''}`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button 
              className="page-nav next" 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminPage;
