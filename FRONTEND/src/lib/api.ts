import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPublic: boolean;
  summary: string;
  image?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
};

// Journal API
export const journalAPI = {
  create: (data: Omit<Journal, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>) =>
    api.post<Journal>('/journals', data),
  
  getAll: () => api.get<Journal[]>('/journals'),
  
  getById: (id: string) => api.get<Journal>(`/journals/${id}`),
  
  update: (id: string, data: Partial<Omit<Journal, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Journal>(`/journals/${id}`, data),
  
  delete: (id: string) => api.delete(`/journals/${id}`),
  
  search: (query: string) => api.post<Journal[]>('/journals/search', { query }),
};

export default api;