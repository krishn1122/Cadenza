import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import googleIcon from '../../../public/assets/images/google-icon.png';
import linkedinIcon from '../../../public/assets/images/linkedin-icon.png';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Please enter both email and password');
      }

      const result = await authService.login(email, password);
      if (result) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    try {
      authService.loginWithGoogle();
      // Note: No navigate here as we're redirecting to Google OAuth
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handleLinkedInSignIn = () => {
    try {
      authService.loginWithLinkedIn();
      // Note: No navigate here as we're redirecting to LinkedIn OAuth
    } catch (err) {
      setError('LinkedIn sign-in failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-container">
          <div className="logo"></div>
        </div>

        <h2 className="welcome-text">Welcome Back</h2>
        
        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <label htmlFor="email">Email<span className="required">*</span></label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password<span className="required">*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <span 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <button 
            type="submit" 
            className="sign-in-btn" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="divider">
          <span>Or</span>
        </div>
        
        <div className="social-login">
          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleSignIn}
          >
            <img src={googleIcon} alt="google" className='signin-option-icon'/>
            Sign in with Google
          </button>
          
          <button 
            type="button" 
            className="linkedin-btn" 
            onClick={handleLinkedInSignIn}
          >
            <img src={linkedinIcon} alt="linkedin" className='signin-option-icon'/>
            Sign in with LinkedIn
          </button>
        </div>
        
        <div className="signup-prompt">
          Don't have an account? <Link to="/signup">Sign Up</Link>
          <p className="terms-text">Using the Keap Watching Us platform means you agree to the <Link to="/terms">Terms of Use</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
