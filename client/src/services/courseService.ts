import apiClient from './api';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../../shared/src';

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await apiClient.get('/courses');
    return response.data;
  },

  async getCourse(id: string): Promise<Course> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  async createCourse(course: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post('/courses', course);
    return response.data;
  },

  async updateCourse(id: string, updates: UpdateCourseRequest): Promise<Course> {
    const response = await apiClient.put(`/courses/${id}`, updates);
    return response.data;
  },

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  },
};