import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import { authService } from '../../services/auth';
import { blogService, BlogPost } from '../../services/blog';
import './BlogManagementPage.scss';

// BlogPost interface is now imported from the blog service

const BlogManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Mock total pages
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if current user is admin
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.is_admin) {
      navigate('/dashboard');
    } else {
      setIsAdmin(true);
      fetchBlogPosts(currentPage);
    }
  }, [currentPage, navigate]);

  const fetchBlogPosts = async (page: number) => {
    setLoading(true);
    
    try {
      // Use the blog service to fetch posts
      const response = await blogService.getBlogPosts(page);
      setBlogPosts(response.posts);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const togglePinned = async (id: number) => {
    // Optimistically update the UI
    setBlogPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === id ? { ...post, isPinned: !post.isPinned } : post
      )
    );
    
    try {
      // Update the pinned status via the service
      const success = await blogService.togglePinned(id);
      if (!success) {
        console.error(`Failed to toggle pin status for post ${id}`);
        // Revert the UI change if the API call failed
        setBlogPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === id ? { ...post, isPinned: !post.isPinned } : post
          )
        );
      }
    } catch (error) {
      console.error(`Error toggling pin status for post ${id}:`, error);
      // Revert the UI change if there was an error
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === id ? { ...post, isPinned: !post.isPinned } : post
        )
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAdmin) {
    return null; // Redirect happens in useEffect
  }

  return (
    <MainLayout activePage="admin">
      <div className="blog-management-page">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackToDashboard}>
            <i className="bi bi-arrow-left"></i> Back to Admin
          </button>
        </div>
        
        <div className="blog-management-header">
          <div className="blog-title-section">
            <h1 className="blog-title">Cadenza Blog Posts</h1>
            <p className="blog-subtitle">Select which post should be visible on home page</p>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading blog posts...</div>
        ) : (
          <div className="blog-posts-grid">
            {blogPosts.map((post) => (
              <div key={post.id} className="blog-post-card">
                <div className="blog-post-image">
                  <img src={post.imageUrl} alt={post.title} />
                  <button 
                    className={`pin-button ${post.isPinned ? 'pinned' : ''}`}
                    onClick={() => togglePinned(post.id)}
                  >
                    {post.isPinned ? (
                      <>
                        <i className="bi bi-pin-fill"></i> Pinned on Home Page
                      </>
                    ) : (
                      <i className="bi bi-pin"></i>
                    )}
                  </button>
                </div>
                <div className="blog-post-content">
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-post-date">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="pagination">
          <button 
            className="pagination-button" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <span className="pagination-ellipsis">...</span>
              
              {[9, 10].map(pageNumber => (
                <button
                  key={pageNumber}
                  className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </>
          )}
          
          <button 
            className="pagination-button" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default BlogManagementPage;
