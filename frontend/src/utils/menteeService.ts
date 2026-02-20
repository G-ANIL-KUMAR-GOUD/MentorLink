import { apiClient } from './api';

export interface MenteeProfile {
  menteeId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  bio: string;
  enrollmentDate: string;
  profileImageUrl?: string;
}

export interface AssignedMentor {
  mentorId: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  assignedDate: string;
  progress: number;
}

export interface MenteeRequest {
  menteeId: number;
  mentorId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestDate: string;
}

export const menteeService = {
  getProfile: async (menteeId: number): Promise<MenteeProfile> => {
    return apiClient.get<MenteeProfile>(`/mentees/${menteeId}`);
  },

  getCurrentMenteeProfile: async (): Promise<MenteeProfile> => {
    try {
      // Try /api/mentees/profile endpoint (preferred)
      return await apiClient.get<MenteeProfile>('/mentees/profile');
    } catch (error: any) {
      // Fallback: Try /api/users/profile for current user
      if (error.message?.includes('404')) {
        try {
          const userProfile = await apiClient.get<any>('/users/profile');
          return {
            menteeId: userProfile.userId,
            userId: userProfile.userId,
            firstName: userProfile.firstName || 'User',
            lastName: userProfile.lastName || '',
            email: userProfile.email || '',
            skills: userProfile.skills || [],
            bio: userProfile.bio || '',
            enrollmentDate: new Date().toISOString(),
            profileImageUrl: userProfile.profileImageUrl,
          };
        } catch {
          // If all else fails, throw the original error
          throw error;
        }
      }
      throw error;
    }
  },

  updateMenteeProfile: async (menteeId: number, data: Partial<MenteeProfile>): Promise<MenteeProfile> => {
    try {
      return await apiClient.put<MenteeProfile>(`/mentees/${menteeId}`, data);
    } catch (error: any) {
      // Fallback: Try /api/users/{id} endpoint
      if (error.message?.includes('404')) {
        const updatedUser = await apiClient.put<any>(`/users/${menteeId}`, data);
        return {
          menteeId: updatedUser.userId,
          userId: updatedUser.userId,
          firstName: updatedUser.firstName || data.firstName || 'User',
          lastName: updatedUser.lastName || data.lastName || '',
          email: updatedUser.email || data.email || '',
          skills: updatedUser.skills || data.skills || [],
          bio: updatedUser.bio || data.bio || '',
          enrollmentDate: new Date().toISOString(),
          profileImageUrl: updatedUser.profileImageUrl,
        };
      }
      throw error;
    }
  },

  getMentees: async (): Promise<MenteeProfile[]> => {
    return apiClient.get<MenteeProfile[]>('/mentees');
  },

  getMenteeById: async (menteeId: number): Promise<MenteeProfile> => {
    return apiClient.get<MenteeProfile>(`/mentees/${menteeId}`);
  },

  getAssignedMentors: async (menteeId: number): Promise<AssignedMentor[]> => {
    try {
      // Try primary endpoint /api/mentees/{id}/mentors
      return await apiClient.get<AssignedMentor[]>(`/mentees/${menteeId}/mentors`);
    } catch (error: any) {
      // Fallback: Return empty array with message for UI to handle
      if (error.message?.includes('404')) {
        console.warn(
          'Endpoint GET /api/mentees/{id}/mentors not implemented. ' +
          'Backend must create this endpoint to show assigned mentors.'
        );
        return [];
      }
      throw error;
    }
  },

  requestMentor: async (menteeId: number, mentorId: number): Promise<MenteeRequest> => {
    return apiClient.post<MenteeRequest>('/mentees/request-mentor', { menteeId, mentorId });
  },

  getMenteeRequests: async (menteeId: number): Promise<MenteeRequest[]> => {
    return apiClient.get<MenteeRequest[]>(`/mentees/${menteeId}/requests`);
  },
};
