import axios, { AxiosResponse, AxiosError } from 'axios';

// Define types for our authentication
export interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string; // For compatibility with backend
  is_admin: boolean;
  is_cadenza: boolean;
  profile_picture?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_ENDPOINT = `${API_URL}/auth`;

// Create axios instance with default config
const authClient = axios.create({
  baseURL: AUTH_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for handling errors
authClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle error globally
    const errorMessage = 
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data 
        ? (error.response.data as { message: string }).message 
        : error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

// Set token in headers for future requests
const setAuthToken = (token: string): void => {
  if (token) {
    localStorage.setItem('token', token);
    authClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete authClient.defaults.headers.common['Authorization'];
  }
};

// Login with email and password
const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authClient.post<AuthResponse>('/login', { email, password });
    const { token } = response.data;
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login with Google
const loginWithGoogle = async (): Promise<void> => {
  window.location.href = `${AUTH_ENDPOINT}/google`;
};

// Login with LinkedIn
const loginWithLinkedIn = async (): Promise<void> => {
  window.location.href = `${AUTH_ENDPOINT}/linkedin`;
};

// Logout
const logout = (): void => {
  setAuthToken('');
  localStorage.removeItem('user');
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get current user
const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  const user = JSON.parse(userStr) as User;
  // Handle name/full_name compatibility
  if (user.full_name && !user.name) {
    user.name = user.full_name;
  }
  return user;
};

// Handle OAuth callback
const handleAuthCallback = async (provider: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await authClient.post<AuthResponse>(`/${provider}/callback`, { code });
    const { token } = response.data;
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Signup with email and password
const signup = async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authClient.post<AuthResponse>('/register', {
      full_name: fullName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export auth service
export const authService = {
  login,
  signup,
  loginWithGoogle,
  loginWithLinkedIn,
  logout,
  isAuthenticated,
  getCurrentUser,
  handleAuthCallback,
};
