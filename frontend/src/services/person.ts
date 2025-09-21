import axios, { AxiosResponse, AxiosError } from 'axios';

// API URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PEOPLE_ENDPOINT = `${API_URL}/people`;

// Define types for person data
export interface Person {
  id: number;
  name: string;
  // Note: avatar is now retrieved via API endpoint
  // avatar fields no longer directly used in the interface
  category: string;
  location: string;
  description: string;
  verified: boolean;
  company?: string;
  position?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  education?: string;
  experience?: string;
  skills?: string;
  achievements?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonSearchResponse {
  success: boolean;
  data: Person[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Create axios instance with default config
const personClient = axios.create({
  baseURL: PEOPLE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
personClient.interceptors.request.use(
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
personClient.interceptors.response.use(
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

// Get all people with search and pagination
const searchPeople = async (search: string = '', page: number = 1, limit: number = 10): Promise<PersonSearchResponse> => {
  try {
    const response = await personClient.get<PersonSearchResponse>('/', {
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

// Get a person by ID
const getPersonById = async (id: number): Promise<Person> => {
  try {
    const response = await personClient.get<{success: boolean; data: Person}>(`/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create a new person
const createPerson = async (personData: Omit<Person, 'id'>): Promise<Person> => {
  try {
    const response = await personClient.post<{success: boolean; data: Person}>('/', personData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update a person
const updatePerson = async (id: number, personData: Partial<Person>): Promise<Person> => {
  try {
    const response = await personClient.put<{success: boolean; data: Person}>(`/${id}`, personData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete a person
const deletePerson = async (id: number): Promise<void> => {
  try {
    await personClient.delete(`/${id}`);
    return;
  } catch (error) {
    throw error;
  }
};

// Export person service functions
export const personService = {
  searchPeople,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
};
