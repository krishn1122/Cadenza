import axios, { AxiosResponse, AxiosError } from 'axios';

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const COMPANY_ENDPOINT = `${API_URL}/companies`;

// Define types for company data
export interface Company {
  id: number;
  name: string;
  // Note: logo is now retrieved via API endpoint
  // logo fields no longer directly used in the interface
  category: string;
  location: string;
  description: string;
  verified: boolean;
  stage?: string;
  website?: string;
  founded_year?: number;
  employee_count?: string;
  funding_stage?: string;
  total_funding?: string;
  investor_information?: string;
  product_description?: string;
  business_model?: string;
  target_market?: string;
  competitive_landscape?: string;
  traction_metrics?: string;
  tractionScore?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySearchResponse {
  success: boolean;
  data: Company[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Create axios instance with default config
const companyClient = axios.create({
  baseURL: COMPANY_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
companyClient.interceptors.request.use(
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
companyClient.interceptors.response.use(
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

// Get all companies with search and pagination
const searchCompanies = async (search: string = '', page: number = 1, limit: number = 10): Promise<CompanySearchResponse> => {
  try {
    const response = await companyClient.get<CompanySearchResponse>('/', {
      params: {
        search,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a company by ID
const getCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await companyClient.get<{success: boolean; data: Company}>(`/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create a new company
const createCompany = async (companyData: Omit<Company, 'id'>): Promise<Company> => {
  try {
    const response = await companyClient.post<{success: boolean; data: Company}>('/', companyData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update a company
const updateCompany = async (id: number, companyData: Partial<Company>): Promise<Company> => {
  try {
    const response = await companyClient.put<{success: boolean; data: Company}>(`/${id}`, companyData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete a company
const deleteCompany = async (id: number): Promise<void> => {
  try {
    await companyClient.delete(`/${id}`);
    return;
  } catch (error) {
    throw error;
  }
};

// Export company service functions
export const companyService = {
  searchCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
