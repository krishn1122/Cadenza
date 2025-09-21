import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import googleIcon from '../../../public/assets/images/google-icon.png';
import linkedinIcon from '../../../public/assets/images/linkedin-icon.png';
import './SignupPage.scss';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!fullName.trim()) {
        throw new Error('Please enter your full name');
      }
      
      if (!email.trim()) {
        throw new Error('Please enter your email');
      }
      
      if (!password.trim()) {
        throw new Error('Please enter a password');
      }

      // Call the backend API to register the user
      await authService.signup(fullName, email, password);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    try {
      authService.loginWithGoogle();
      // Note: No navigate here as we're redirecting to Google OAuth
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
    }
  };

  const handleLinkedInSignUp = () => {
    try {
      authService.loginWithLinkedIn();
      // Note: No navigate here as we're redirecting to LinkedIn OAuth
    } catch (err) {
      setError('LinkedIn sign-up failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="logo-container">
          <div className="logo"></div>
        </div>

        <h2 className="welcome-text">Create Your Account</h2>
        
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name<span className="required">*</span></label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              required
            />
          </div>
          
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
            className="sign-up-btn" 
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="divider">
          <span>Or</span>
        </div>
        
        <div className="social-login">
          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleSignUp}
          >
            <img src={googleIcon} alt="google" className='signin-option-icon'/>
            Sign up with Google
          </button>
          
          <button 
            type="button" 
            className="linkedin-btn" 
            onClick={handleLinkedInSignUp}
          >
            <img src={linkedinIcon} alt="linkedin" className='signin-option-icon'/>
            Sign up with LinkedIn
          </button>
        </div>
        
        <div className="login-prompt">
          Already have an account? <Link to="/login">Sign In</Link>
          <p className="terms-text">Using the Keap Watching Us platform means you agree to the <Link to="/terms">Terms of Use</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
