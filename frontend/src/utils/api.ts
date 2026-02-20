const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      try {
        const jsonError = JSON.parse(error);
        throw new Error(jsonError.message || `HTTP ${response.status}`);
      } catch {
        throw new Error(`HTTP ${response.status}: ${error}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }
    return response.text() as any;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'GET',
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      // Improve CORS error messaging
      if (error.message === 'Failed to fetch') {
        throw new Error(
          `Failed to reach backend at ${this.baseUrl}\n\n` +
          'Possible causes:\n' +
          '1. Backend server is not running\n' +
          '2. CORS is not configured (check SecurityConfig.java)\n' +
          '3. Backend port is wrong (check VITE_API_URL)'
        );
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error(
          `Failed to reach backend at ${this.baseUrl}\n\n` +
          'Possible causes:\n' +
          '1. Backend server is not running\n' +
          '2. CORS is not configured (check SecurityConfig.java)\n' +
          '3. Backend port is wrong (check VITE_API_URL)'
        );
      }
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error(
          `Failed to reach backend at ${this.baseUrl}\n\n` +
          'Possible causes:\n' +
          '1. Backend server is not running\n' +
          '2. CORS is not configured (check SecurityConfig.java)\n' +
          '3. Backend port is wrong (check VITE_API_URL)'
        );
      }
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'PATCH',
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error(
          `Failed to reach backend at ${this.baseUrl}\n\n` +
          'Possible causes:\n' +
          '1. Backend server is not running\n' +
          '2. CORS is not configured (check SecurityConfig.java)\n' +
          '3. Backend port is wrong (check VITE_API_URL)'
        );
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: 'DELETE',
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
      });
      return this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        throw new Error(
          `Failed to reach backend at ${this.baseUrl}\n\n` +
          'Possible causes:\n' +
          '1. Backend server is not running\n' +
          '2. CORS is not configured (check SecurityConfig.java)\n' +
          '3. Backend port is wrong (check VITE_API_URL)'
        );
      }
      throw error;
    }
  }

  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  clearToken() {
    localStorage.removeItem('auth_token');
  }
}

export const apiClient = new ApiClient();
