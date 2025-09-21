import axios, { AxiosResponse, AxiosError } from 'axios';

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_ENDPOINT = `${API_URL}/users`;

// Define types for user data
export interface User {
  id: string;
  full_name: string;
  email: string;
  is_cadenza: boolean;
  is_admin: boolean;
}

export interface UsersResponse {
  users: User[];
  totalPages: number;
  currentPage: number;
}

// Create axios instance with default config
const userClient = axios.create({
  baseURL: USER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
userClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling errors
userClient.interceptors.response.use(
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

// Get all users with pagination
const getUsers = async (page: number = 1): Promise<UsersResponse> => {
  try {
    const response = await userClient.get<UsersResponse>(`/all`);
    // Simulate pagination for now since the backend doesn't support it yet
    const users = response.data as unknown as User[];
    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, users.length);
    
    return {
      users: users.slice(start, end),
      totalPages: totalPages,
      currentPage: page
    };
  } catch (error) {
    throw error;
  }
};

// Update user admin status
const updateAdminStatus = async (userId: string, isAdmin: boolean): Promise<User> => {
  try {
    const response = await userClient.put<User>(`/${userId}/admin-status`, { is_admin: isAdmin });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Export user service functions
export const userService = {
  getUsers,
  updateAdminStatus,
};
