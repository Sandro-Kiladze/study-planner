import apiClient from './api';
import { Assignment, CreateAssignmentRequest, UpdateAssignmentRequest } from '../../../shared/src';

export interface AssignmentFilters {
  courseId?: string;
  status?: string;
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export const assignmentService = {
  async getAssignments(filters?: AssignmentFilters): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response = await apiClient.get(`/assignments?${params.toString()}`);
    return response.data;
  },

  async getAssignment(id: string): Promise<Assignment> {
    const response = await apiClient.get(`/assignments/${id}`);
    return response.data;
  },

  async createAssignment(assignment: CreateAssignmentRequest): Promise<Assignment> {
    const response = await apiClient.post('/assignments', assignment);
    return response.data;
  },

  async updateAssignment(id: string, updates: UpdateAssignmentRequest): Promise<Assignment> {
    const response = await apiClient.put(`/assignments/${id}`, updates);
    return response.data;
  },

  async deleteAssignment(id: string): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};