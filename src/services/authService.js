// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await refreshAccessToken(refreshToken);
          localStorage.setItem('access_token', response.access_token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed, redirect to login
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ============= AUTH FUNCTIONS =============

export const authService = {
  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    const { access_token, refresh_token, user } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refresh_token, user } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async refreshAccessToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  },
};

// ============= USER PROFILE FUNCTIONS (NEW) =============

export const userService = {
  async updateProfile(userData) {
    const response = await api.put('/users/me', userData);
    
    // Update stored user info
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  async deleteAccount() {
    await api.delete('/users/me');
    
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }
};

// Export individual functions for convenience
export const { signup, login, logout, getCurrentUser, isAuthenticated } = authService;

export default api;