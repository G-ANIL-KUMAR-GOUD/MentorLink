import { apiClient } from './api';

export interface MentorPerformance {
  mentorId: number;
  mentorName: string;
  averageRating: number;
  totalTasks: number;
  completedTasks: number;
  menteeCount: number;
}

export interface MenteeProgress {
  menteeId: number;
  menteeName: string;
  completedTasks: number;
  totalTasks: number;
  averageProgress: number;
  feedbackCount: number;
}

export interface BatchAnalytics {
  batchId: number;
  batchName: string;
  totalMentors: number;
  totalMentees: number;
  averageProgress: number;
  completionRate: number;
}

export const analyticsService = {
  getMentorPerformance: async (mentorId: number): Promise<MentorPerformance> => {
    return apiClient.get<MentorPerformance>(`/analytics/mentor/${mentorId}`);
  },

  getMenteeProgress: async (menteeId: number): Promise<MenteeProgress> => {
    return apiClient.get<MenteeProgress>(`/analytics/mentee/${menteeId}`);
  },

  getBatchAnalytics: async (batchId: number): Promise<BatchAnalytics> => {
    return apiClient.get<BatchAnalytics>(`/analytics/batch/${batchId}`);
  },
};
