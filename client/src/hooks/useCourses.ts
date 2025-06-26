import { useCallback } from 'react';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../../shared/src';
import { courseService } from '../services/courseService';
import { useApi } from './useApi';
import { useAssignments } from './useAssignments';

export function useCourses() {
  const apiCall = useCallback(() => courseService.getCourses(), []);
  const { data, loading, error, refetch } = useApi<Course[]>(apiCall);
  const courses = data || [];
  
  // ADD THIS LINE - actually call the useAssignments hook
  const { assignments } = useAssignments();

  const createCourse = async (courseData: CreateCourseRequest): Promise<Course> => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      await refetch();
      return newCourse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const updateCourse = async (id: string, updates: UpdateCourseRequest): Promise<Course> => {
    try {
      const updatedCourse = await courseService.updateCourse(id, updates);
      await refetch();
      return updatedCourse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update course');
    }
  };

  const deleteCourse = async (id: string): Promise<void> => {
    try {
      await courseService.deleteCourse(id);
      await refetch();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const getAssignmentCountByCourse = (courseId: string): number => {
    return assignments.filter(assignment => assignment.courseId === courseId).length;
  };

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };

  const getCoursesByAssignments = (): Course[] => {
    const coursesWithAssignments = courses.filter(course =>
      assignments.some(assignment => assignment.courseId === course.id)
    );
    return coursesWithAssignments;
  };
 
  return {
    courses,
    loading,
    error,
    refetch,
    createCourse,
    updateCourse,
    deleteCourse,    
    getAssignmentCountByCourse,
    getCourseById,
    getCoursesByAssignments
  };
}