import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.scss';
import { getFallbackImageUrl } from '../../utils/imageUtils';

interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  image_url: string | null;
  category: string | null;
  tags: string | null;
  published: boolean;
  publish_date: string;
  author: {
    id: number;
    full_name: string;
    email: string;
  };
}

const HomePage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Directly use localhost:5000 since we know it's working from our curl test
        const response = await axios.get('http://localhost:5000/api/blogs');
        console.log('Blog API response:', response.data);
        
        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);
          setError(null);
        } else {
          console.error('Invalid API response format:', response.data);
          setError('Invalid response from server. Please try again later.');
        }
      } catch (err: any) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <MainLayout activePage="home">
      <div className="blog-content">
        <div className="blog-header">
          <h2 className="blog-title">Cadenza Blog Posts</h2>
          <p className="blog-subtitle">Insider knowledge & insights into Blockchain, AI, Fintech, Venture Capital & much more</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="no-blogs-message">
            <p>No blog posts available at the moment.</p>
          </div>
        ) : (
          <div className="blog-posts">
            {blogs.map(blog => (
              <div className="blog-post" key={blog.id}>
                <div className="blog-post-image">
                  <img 
                    src={blog.image_url || ''}
                    alt={blog.title}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = getFallbackImageUrl('', 'blog', blog.id);
                    }}
                  />
                </div>
                <div className="blog-post-content">
                  <h3 className="blog-post-title">{blog.title}</h3>
                  <p className="blog-post-date">{new Date(blog.publish_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <Link to={`/blog/${blog.id}`} className="read-more-btn">Read More</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
