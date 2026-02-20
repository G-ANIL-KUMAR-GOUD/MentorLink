import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId?: number;
}

export interface AuthResponse {
  token: string;
  role: string;
  userId: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}

/**
 * IMPORTANT: Signup endpoint not yet implemented in backend
 * Backend must create POST /api/auth/signup endpoint
 * 
 * Expected request:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "roleId": 3
 * }
 * 
 * Expected response: Same as login response (AuthResponse)
 */

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      // Ensure response has required fields
      if (!response.email && credentials.email) {
        response.email = credentials.email;
      }
      return response;
    } catch (error: any) {
      // Check for CORS errors
      if (error.message?.includes('Failed to fetch')) {
        throw new Error(
          'Cannot connect to backend. Check that:\n' +
          '1. Backend is running on http://localhost:8080\n' +
          '2. CORS is configured to allow requests from http://localhost:5173'
        );
      }
      throw error;
    }
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>('/auth/signup', data);
    } catch (error: any) {
      // Provide helpful error message for unsupported signup
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        throw new Error(
          'Signup endpoint not yet implemented on backend.\n\n' +
          'Backend must create: POST /api/auth/signup\n' +
          'Backend developer: See documentation for required fields.'
        );
      }
      // Check for CORS errors
      if (error.message?.includes('Failed to fetch')) {
        throw new Error(
          'Cannot connect to backend. Check that:\n' +
          '1. Backend is running on http://localhost:8080\n' +
          '2. CORS is configured to allow requests from http://localhost:5173'
        );
      }
      throw error;
    }
  },

  logout: () => {
    apiClient.clearToken();
  },

  setToken: (token: string) => {
    apiClient.setToken(token);
  },

  getToken: () => {
    return apiClient.getToken();
  },
};
