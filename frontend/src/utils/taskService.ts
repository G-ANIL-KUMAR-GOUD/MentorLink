/**
 * IMPORTANT: Backend Task model is missing 'title' and 'progress' fields
 * This service adds fallback/workaround logic:
 * - Uses 'description' as 'title' when title is missing
 * - Defaults 'progress' to 0 when missing
 * 
 * TODO: Backend must add 'title' and 'progress' columns to Task table
 */

const transformTaskResponse = (apiTask: any): Task => {
  return {
    id: apiTask.id,
    title: apiTask.title || apiTask.description || 'Untitled Task', // Fallback to description if title missing
    description: apiTask.description || '',
    status: apiTask.status || 'NOT_STARTED',
    progress: apiTask.progress ?? 0, // Default to 0 if missing
    assignedDate: apiTask.assignedDate || apiTask.createdAt || new Date().toISOString(),
    dueDate: apiTask.dueDate,
    completedDate: apiTask.completedDate,
    assignedBy: apiTask.assignedBy || 'Unknown',
    comments: apiTask.comments || [],
  };
};

export const taskService = {
  getTasks: async (params?: Record<string, any>): Promise<Task[]> => {
    const queryString = new URLSearchParams(params).toString();
    const tasks = await apiClient.get<any[]>(`/tasks${queryString ? '?' + queryString : ''}`);
    return tasks.map(transformTaskResponse);
  },

  getTaskById: async (taskId: number): Promise<Task> => {
    const task = await apiClient.get<any>(`/tasks/${taskId}`);
    return transformTaskResponse(task);
  },

  getTasksByMentor: async (mentorId: number): Promise<Task[]> => {
    try {
      const tasks = await apiClient.get<any[]>(`/tasks/mentor/${mentorId}`);
      return tasks.map(transformTaskResponse);
    } catch (error: any) {
      // Fallback: If endpoint doesn't exist, return empty array
      if (error.message?.includes('404')) {
        console.warn(
          `Endpoint GET /api/tasks/mentor/${mentorId} not fully implemented. ` +
          'Showing no tasks for this mentor.'
        );
        return [];
      }
      throw error;
    }
  },

  getTasksByMentee: async (menteeId: number): Promise<Task[]> => {
    try {
      const tasks = await apiClient.get<any[]>(`/tasks/mentee/${menteeId}`);
      return tasks.map(transformTaskResponse);
    } catch (error: any) {
      // Fallback: If endpoint doesn't exist, return empty array
      if (error.message?.includes('404')) {
        console.warn(
          `Endpoint GET /api/tasks/mentee/${menteeId} not fully implemented. ` +
          'Showing no tasks for this mentee.'
        );
        return [];
      }
      throw error;
    }
  },

  createTask: async (data: AssignTaskRequest): Promise<Task> => {
    const task = await apiClient.post<any>('/tasks', data);
    return transformTaskResponse(task);
  },

  updateTask: async (taskId: number, data: UpdateTaskRequest): Promise<Task> => {
    try {
      // Try general PUT endpoint first
      const task = await apiClient.put<any>(`/tasks/${taskId}`, data);
      return transformTaskResponse(task);
    } catch (error: any) {
      // Fallback: Try status-specific endpoint if general update fails
      if (data.status && error.message?.includes('404')) {
        try {
          const task = await apiClient.put<any>(`/tasks/${taskId}/status`, { status: data.status });
          return transformTaskResponse(task);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  },

  deleteTask: async (taskId: number): Promise<void> => {
    return apiClient.delete(`/tasks/${taskId}`);
  },

  addComment: async (taskId: number, text: string): Promise<TaskComment> => {
    try {
      return await apiClient.post<TaskComment>(`/tasks/${taskId}/comments`, { text });
    } catch (error: any) {
      // Fallback: If comment endpoint doesn't exist, return mock comment
      if (error.message?.includes('404')) {
        console.warn(
          'Task comments endpoint not implemented. ' +
          'Comments will not be saved to backend.'
        );
        return {
          id: Date.now(),
          author: 'You',
          text,
          createdAt: new Date().toISOString(),
          avatarColor: '#3b82f6',
        };
      }
      throw error;
    }
  },

  getComments: async (taskId: number): Promise<TaskComment[]> => {
    return apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments`);
  },
};
