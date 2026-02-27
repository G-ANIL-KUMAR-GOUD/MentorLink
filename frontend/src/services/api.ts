import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== ADMIN APIs ====================
export const adminApi = {
  // Create a manager
  createManager: async (userData: any) => {
    const response = await api.post("/admin/create-manager", userData);
    return response.data;
  },

  // Assign manager to batch
  assignManagerToBatch: async (batchId: number, managerId: number) => {
    const response = await api.put(
      `/admin/assign-manager/${batchId}/${managerId}`,
    );
    return response.data;
  },

  // Get all batches with managers
  getAllBatches: async () => {
    const response = await api.get("/admin/batches");
    return response.data;
  },
};

// ==================== ANALYTICS APIs ====================
export const analyticsApi = {
  // Get mentor performance
  getMentorPerformance: async (mentorId: number) => {
    const response = await api.get(`/analytics/mentor/${mentorId}`);
    return response.data;
  },

  // Get mentee progress
  getMenteeProgress: async (menteeId: number) => {
    const response = await api.get(`/analytics/mentee/${menteeId}`);
    return response.data;
  },

  // Get batch analytics
  getBatchAnalytics: async (batchId: number) => {
    const response = await api.get(`/analytics/batch/${batchId}`);
    return response.data;
  },
};

// ==================== BATCH APIs ====================
export const batchApi = {
  // Get all batches
  getAllBatches: async () => {
    const response = await api.get("/batches");
    return response.data;
  },

  // Get batch by ID
  getBatchById: async (id: number) => {
    const response = await api.get(`/batches/${id}`);
    return response.data;
  },

  // Create batch
  createBatch: async (batchData: any) => {
    const response = await api.post("/batches", batchData);
    return response.data;
  },

  // Update batch
  updateBatch: async (id: number, batchData: any) => {
    const response = await api.put(`/batches/${id}`, batchData);
    return response.data;
  },

  // Delete batch
  deleteBatch: async (id: number) => {
    await api.delete(`/batches/${id}`);
  },

  // Assign manager to batch
  assignManager: async (batchId: number, managerId: number) => {
    const response = await api.put(
      `/batches/${batchId}/assign-manager/${managerId}`,
    );
    return response.data;
  },

  // Assign mentee to batch
  assignMentee: async (batchId: number, menteeId: number) => {
    const response = await api.put(
      `/batches/${batchId}/assign-mentee/${menteeId}`,
    );
    return response.data;
  },
};

// ==================== FEEDBACK APIs ====================
export const feedbackApi = {
  // Submit feedback
  submitFeedback: async (mapId: number, comments: string, rating: number) => {
    const response = await api.post("/feedback/submit", null, {
      params: { mapId, comments, rating },
    });
    return response.data;
  },

  // Get feedback for mapping
  getFeedbackForMapping: async (mapId: number) => {
    const response = await api.get(`/feedback/map/${mapId}`);
    return response.data;
  },

  // Get feedback for mentor
  getFeedbackForMentor: async (mentorId: number) => {
    const response = await api.get(`/feedback/mentor/${mentorId}`);
    return response.data;
  },

  // Get feedback for mentee
  getFeedbackForMentee: async (menteeId: number) => {
    const response = await api.get(`/feedback/mentee/${menteeId}`);
    return response.data;
  },
};

// ==================== MENTEE APIs ====================
export const menteeApi = {
  // Get all mentees
  getAllMentees: async () => {
    const response = await api.get("/mentees");
    return response.data;
  },

  // Get mentee by ID
  getMenteeById: async (id: number) => {
    const response = await api.get(`/mentees/${id}`);
    return response.data;
  },

  // Create mentee
  createMentee: async (menteeData: any) => {
    const response = await api.post("/mentees", menteeData);
    return response.data;
  },

  // Assign skills to mentee
  assignSkills: async (id: number, skillIds: number[]) => {
    const response = await api.put(`/mentees/${id}/skills`, skillIds);
    return response.data;
  },

  // Assign mentee to batch (updates profile)
  assignBatch: async (id: number, batchId: number) => {
    const response = await api.put(`/mentees/${id}/batch/${batchId}`);
    return response.data;
  },

  // Add single skill to mentee
  addSkill: async (id: number, skillId: number) => {
    const response = await api.post(`/mentees/${id}/skills/${skillId}`);
    return response.data;
  },

  // Remove skill from mentee
  removeSkill: async (id: number, skillId: number) => {
    const response = await api.delete(`/mentees/${id}/skills/${skillId}`);
    return response.data;
  },
};

// ==================== MENTEE PROFILE APIs ====================
export const menteeProfileApi = {
  // Create mentee profile
  createMenteeProfile: async (params: {
    userId: number;
    currentRole: string;
    education: string;
    goals: string;
    interests: string;
    batchId?: number;
    skillIds?: number[];
  }) => {
    const response = await api.post("/mentee-profiles", null, { params });
    return response.data;
  },

  // Get mentee profile
  getMenteeProfile: async (id: number) => {
    const response = await api.get(`/mentee-profiles/${id}`);
    return response.data;
  },

  // Assign batch to existing profile
  assignBatch: async (profileId: number, batchId: number) => {
    const response = await api.put(`/mentee-profiles/${profileId}/assign-batch/${batchId}`);
    return response.data;
  },
};

// ==================== MENTOR APIs ====================
export const mentorApi = {
  // Get all mentors
  getAllMentors: async () => {
    const response = await api.get("/mentors");
    return response.data;
  },

  // Get mentor by ID
  getMentorById: async (id: number) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },

  // Create mentor
  createMentor: async (mentorData: any) => {
    const response = await api.post("/mentors", mentorData);
    return response.data;
  },

  // Assign skills to mentor
  assignSkills: async (id: number, skillIds: number[]) => {
    const response = await api.put(`/mentors/${id}/skills`, skillIds);
    return response.data;
  },

  // Add single skill to mentor
  addSkill: async (id: number, skillId: number) => {
    const response = await api.post(`/mentors/${id}/skills/${skillId}`);
    return response.data;
  },

  // Remove skill from mentor
  removeSkill: async (id: number, skillId: number) => {
    const response = await api.delete(`/mentors/${id}/skills/${skillId}`);
    return response.data;
  },
};

// ==================== MENTOR PROFILE APIs ====================
export const mentorProfileApi = {
  // Create mentor profile
  createMentorProfile: async (params: {
    userId: number;
    headline: string;
    experienceYears: number;
    expertiseArea: string;
    linkedinUrl?: string;
    availability?: string;
    skillIds?: number[];
  }) => {
    const response = await api.post("/mentor-profiles", null, { params });
    return response.data;
  },

  // Get mentor profile
  getMentorProfile: async (id: number) => {
    const response = await api.get(`/mentor-profiles/${id}`);
    return response.data;
  },
};

// ==================== MENTOR-MENTEE MAP APIs ====================
export const mentorMenteeMapApi = {
  // Request a mentor
  requestMentor: async (
    menteeId: number,
    mentorId: number,
    batchId: number,
    focusArea: string,
  ) => {
    const response = await api.post("/mentor-mentee/request", null, {
      params: { menteeId, mentorId, batchId, focusArea },
    });
    return response.data;
  },

  // Approve mentee request
  approveRequest: async (mapId: number) => {
    const response = await api.put(`/mentor-mentee/${mapId}/approve`);
    return response.data;
  },

  // Get mentees for mentor
  getMenteesForMentor: async (mentorId: number) => {
    const response = await api.get(`/mentor-mentee/mentor/${mentorId}`);
    return response.data;
  },

  // Get mentors for mentee
  getMentorsForMentee: async (menteeId: number) => {
    const response = await api.get(`/mentor-mentee/mentee/${menteeId}`);
    return response.data;
  },

  // Get mappings for batch
  getMappingsForBatch: async (batchId: number) => {
    const response = await api.get(`/mentor-mentee/batch/${batchId}`);
    return response.data;
  },
};

// ==================== ROLE APIs ====================
export const roleApi = {
  // Get all roles
  getAllRoles: async () => {
    const response = await api.get("/roles");
    return response.data;
  },

  // Get role by ID
  getRoleById: async (id: number) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },

  // Create role
  createRole: async (roleData: any) => {
    const response = await api.post("/roles", roleData);
    return response.data;
  },

  // Update role
  updateRole: async (id: number, roleData: any) => {
    const response = await api.put(`/roles/${id}`, roleData);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: number) => {
    await api.delete(`/roles/${id}`);
  },
};

// ==================== SKILL APIs ====================
export const skillApi = {
  // Get all skills
  getAllSkills: async () => {
    const response = await api.get("/skills");
    return response.data;
  },

  // Create skill
  createSkill: async (skillData: any) => {
    const response = await api.post("/skills", skillData);
    return response.data;
  },
};

// ==================== TASK APIs ====================
export const taskApi = {
  // Assign task
  assignTask: async (mapId: number, description: string, dueDate: string) => {
    const response = await api.post("/tasks/assign", null, {
      params: { mapId, description, dueDate },
    });
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId: number, status: string) => {
    const response = await api.put(`/tasks/${taskId}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  // Get tasks for mentee
  getTasksForMentee: async (menteeId: number) => {
    const response = await api.get(`/tasks/mentee/${menteeId}`);
    return response.data;
  },

  // Get tasks for mentor
  getTasksForMentor: async (mentorId: number) => {
    const response = await api.get(`/tasks/mentor/${mentorId}`);
    return response.data;
  },

  // Get tasks for mapping
  getTasksForMapping: async (mapId: number) => {
    const response = await api.get(`/tasks/map/${mapId}`);
    return response.data;
  },
};

// ==================== USER APIs ====================
export const userApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData: any) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};

// ==================== USER ROLE APIs ====================
export const userRoleApi = {
  // Assign role to user
  assignRole: async (userId: number, roleId: number, batchId: number) => {
    const response = await api.post("/user-roles/assign", null, {
      params: { userId, roleId, batchId },
    });
    return response.data;
  },

  // Get roles for user
  getRolesForUser: async (userId: number) => {
    const response = await api.get(`/user-roles/user/${userId}`);
    return response.data;
  },

  // Get users for role
  getUsersForRole: async (roleId: number) => {
    const response = await api.get(`/user-roles/role/${roleId}`);
    return response.data;
  },
};

// Export the axios instance for custom requests
export default api;
