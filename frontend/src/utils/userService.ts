import { apiClient } from './api';

export interface UserProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  skills: string[];
  bio?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  skills?: string[];
  bio?: string;
}

export const userService = {
  getProfile: async (userId: number): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(`/users/${userId}`);
  },

  getCurrentUser: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/users/profile');
  },

  updateProfile: async (userId: number, data: UpdateProfileRequest): Promise<UserProfile> => {
    return apiClient.put<UserProfile>(`/users/${userId}`, data);
  },

  getAllUsers: async (): Promise<UserProfile[]> => {
    return apiClient.get<UserProfile[]>('/users');
  },

  getUserById: async (id: number): Promise<UserProfile> => {
    return apiClient.get<UserProfile>(`/users/${id}`);
  },
};
