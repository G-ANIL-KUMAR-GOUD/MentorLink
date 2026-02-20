import { apiClient } from './api';

export interface MentorProfile {
  mentorId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  bio: string;
  averageRating: number;
  experience: string;
  menteeCount: number;
  profileImageUrl?: string;
}

export interface MentorSearchResponse {
  mentors: MentorProfile[];
  total: number;
}

export interface MentorRequest {
  mentorId: number;
  menteeId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestDate: string;
}

export const mentorService = {
  getProfile: async (mentorId: number): Promise<MentorProfile> => {
    return apiClient.get<MentorProfile>(`/mentors/${mentorId}`);
  },

  getCurrentMentorProfile: async (): Promise<MentorProfile> => {
    try {
      // Try /api/mentors/profile endpoint (preferred)
      return await apiClient.get<MentorProfile>('/mentors/profile');
    } catch (error: any) {
      // Fallback: Try /api/users/profile for current user
      if (error.message?.includes('404')) {
        try {
          const userProfile = await apiClient.get<any>('/users/profile');
          return {
            mentorId: userProfile.userId,
            userId: userProfile.userId,
            firstName: userProfile.firstName || 'User',
            lastName: userProfile.lastName || '',
            email: userProfile.email || '',
            skills: userProfile.skills || [],
            bio: userProfile.bio || '',
            averageRating: 0,
            experience: '',
            menteeCount: 0,
            profileImageUrl: userProfile.profileImageUrl,
          };
        } catch {
          throw error;
        }
      }
      throw error;
    }
  },

  searchMentors: async (params?: Record<string, any>): Promise<MentorSearchResponse> => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get<MentorSearchResponse>(`/mentors/search${queryString ? '?' + queryString : ''}`);
  },

  getMentors: async (): Promise<MentorProfile[]> => {
    return apiClient.get<MentorProfile[]>('/mentors');
  },

  getMentorsBySkill: async (skill: string): Promise<MentorProfile[]> => {
    return apiClient.get<MentorProfile[]>(`/mentors/skill/${skill}`);
  },

  updateMentorProfile: async (mentorId: number, data: Partial<MentorProfile>): Promise<MentorProfile> => {
    try {
      return await apiClient.put<MentorProfile>(`/mentors/${mentorId}`, data);
    } catch (error: any) {
      // Fallback: Try /api/users/{id} endpoint
      if (error.message?.includes('404')) {
        const updatedUser = await apiClient.put<any>(`/users/${mentorId}`, data);
        return {
          mentorId: updatedUser.userId,
          userId: updatedUser.userId,
          firstName: updatedUser.firstName || data.firstName || 'User',
          lastName: updatedUser.lastName || data.lastName || '',
          email: updatedUser.email || data.email || '',
          skills: updatedUser.skills || data.skills || [],
          bio: updatedUser.bio || data.bio || '',
          averageRating: data.averageRating || 0,
          experience: data.experience || '',
          menteeCount: data.menteeCount || 0,
          profileImageUrl: updatedUser.profileImageUrl,
        };
      }
      throw error;
    }
  },

  getMentorRequests: async (mentorId: number): Promise<MentorRequest[]> => {
    return apiClient.get<MentorRequest[]>(`/mentors/${mentorId}/requests`);
  },

  respondToRequest: async (mentorId: number, menteeId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<MentorRequest> => {
    return apiClient.post<MentorRequest>(`/mentors/${mentorId}/requests/${menteeId}/respond`, { status });
  },
};
