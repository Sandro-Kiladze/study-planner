import apiClient from './api';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../../shared/src';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await apiClient.get('/api/courses');
    return response.data;
  },

  async getCourse(id: string): Promise<Course> {
    const response = await apiClient.get(`/api/courses/${id}`);
    return response.data;
  },

  async createCourse(course: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post('/api/courses', course);
    return response.data;
  },

  async updateCourse(id: string, updates: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.put(`/api/courses/${id}`, updates);
    return response.data;
  },

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/api/courses/${id}`);
  },
};
