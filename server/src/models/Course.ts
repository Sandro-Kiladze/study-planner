import type { Course } from '../../../shared/src/index';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileDb';
import path from 'path';

const COURSES_FILE = path.join(__dirname, '../data/courses.json');

export interface CreateCourseRequest {
    name: string;
    code: string;
    instructor?: string;
    color: string;
    semester: string;
    year: number;
}

export interface UpdateCourseRequest {
    name?: string;
    code?: string;
    instructor?: string;
    color?: string;
    semester?: string;
    year?: number;
}

export class CourseModel {
    /**
     * Get all courses from the database
     */
    static async getAllCourses(): Promise<Course[]> {
        try {
            const courses = await readJsonFile<Course>(COURSES_FILE);
            return courses;
        } catch (error) {
            console.error('Error getting all courses:', error);
            throw new Error('Failed to retrieve courses');
        }
    }

    /**
     * Get a single course by ID
     */
    static async getCourseById(id: string): Promise<Course | null> {
        try {
            const courses = await this.getAllCourses();
            const course = courses.find(c => c.id === id);
            return course || null;
        } catch (error) {
            console.error(`Error getting course with id ${id}:`, error);
            throw new Error('Failed to retrieve course');
        }
    }

    /**
     * Create a new course
     */
    static async createCourse(courseData: CreateCourseRequest): Promise<Course> {
        try {
            const courses = await readJsonFile<Course>(COURSES_FILE);
            
            // Check if course code already exists for the same semester and year
            const existingCourse = courses.find(c => 
                c.code === courseData.code && 
                c.semester === courseData.semester && 
                c.year === courseData.year
            );
            
            if (existingCourse) {
                throw new Error(`Course with code ${courseData.code} already exists for ${courseData.semester} ${courseData.year}`);
            }
            
            const newCourse: Course = {
                id: generateId(),
                name: courseData.name,
                code: courseData.code,
                instructor: courseData.instructor,
                color: courseData.color,
                semester: courseData.semester,
                year: courseData.year
            };

            courses.push(newCourse);
            await writeJsonFile(COURSES_FILE, courses);
            
            return newCourse;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error; // Re-throw to preserve the specific error message
        }
    }

    /**
     * Update an existing course
     */
    static async updateCourse(id: string, updates: UpdateCourseRequest): Promise<Course> {
        try {
            const courses = await readJsonFile<Course>(COURSES_FILE);
            const courseIndex = courses.findIndex(c => c.id === id);
            
            if (courseIndex === -1) {
                throw new Error('Course not found');
            }

            const existingCourse = courses[courseIndex];
            
            // Check if course code already exists for the same semester and year (excluding current course)
            if (updates.code || updates.semester || updates.year) {
                const checkCode = updates.code || existingCourse.code;
                const checkSemester = updates.semester || existingCourse.semester;
                const checkYear = updates.year || existingCourse.year;
                
                const duplicateCourse = courses.find(c => 
                    c.id !== id && 
                    c.code === checkCode && 
                    c.semester === checkSemester && 
                    c.year === checkYear
                );
                
                if (duplicateCourse) {
                    throw new Error(`Course with code ${checkCode} already exists for ${checkSemester} ${checkYear}`);
                }
            }
            
            const updatedCourse: Course = {
                ...existingCourse,
                ...updates
            };

            courses[courseIndex] = updatedCourse;
            await writeJsonFile(COURSES_FILE, courses);
            
            return updatedCourse;
        } catch (error) {
            console.error(`Error updating course with id ${id}:`, error);
            throw error; // Re-throw to preserve the specific error message
        }
    }

    /**
     * Delete a course by ID
     */
    static async deleteCourse(id: string): Promise<boolean> {
        try {
            const courses = await readJsonFile<Course>(COURSES_FILE);
            const initialLength = courses.length;
            const filteredCourses = courses.filter(c => c.id !== id);
            
            if (filteredCourses.length === initialLength) {
                return false; // Course not found
            }

            await writeJsonFile(COURSES_FILE, filteredCourses);
            return true;
        } catch (error) {
            console.error(`Error deleting course with id ${id}:`, error);
            throw new Error('Failed to delete course');
        }
    }

    /**
     * Get courses by semester and year
     */
    static async getCoursesBySemester(semester: string, year: number): Promise<Course[]> {
        try {
            const courses = await this.getAllCourses();
            return courses.filter(c => c.semester === semester && c.year === year);
        } catch (error) {
            console.error(`Error getting courses for ${semester} ${year}:`, error);
            throw new Error('Failed to retrieve courses by semester');
        }
    }

    /**
     * Get courses by year
     */
    static async getCoursesByYear(year: number): Promise<Course[]> {
        try {
            const courses = await this.getAllCourses();
            return courses.filter(c => c.year === year);
        } catch (error) {
            console.error(`Error getting courses for year ${year}:`, error);
            throw new Error('Failed to retrieve courses by year');
        }
    }

    /**
     * Get course by code, semester, and year
     */
    static async getCourseByCode(code: string, semester: string, year: number): Promise<Course | null> {
        try {
            const courses = await this.getAllCourses();
            const course = courses.find(c => 
                c.code === code && 
                c.semester === semester && 
                c.year === year
            );
            return course || null;
        } catch (error) {
            console.error(`Error getting course with code ${code}:`, error);
            throw new Error('Failed to retrieve course by code');
        }
    }

    /**
     * Search courses by name or code
     */
    static async searchCourses(searchTerm: string): Promise<Course[]> {
        try {
            const courses = await this.getAllCourses();
            const lowercaseSearch = searchTerm.toLowerCase();
            
            return courses.filter(course => 
                course.name.toLowerCase().includes(lowercaseSearch) ||
                course.code.toLowerCase().includes(lowercaseSearch) ||
                (course.instructor && course.instructor.toLowerCase().includes(lowercaseSearch))
            );
        } catch (error) {
            console.error('Error searching courses:', error);
            throw new Error('Failed to search courses');
        }
    }

    /**
     * Get all unique semesters
     */
    static async getAllSemesters(): Promise<string[]> {
        try {
            const courses = await this.getAllCourses();
            const semesters = courses.map(c => c.semester);
            return [...new Set(semesters)].sort();
        } catch (error) {
            console.error('Error getting all semesters:', error);
            throw new Error('Failed to retrieve semesters');
        }
    }

    /**
     * Get all unique years
     */
    static async getAllYears(): Promise<number[]> {
        try {
            const courses = await this.getAllCourses();
            const years = courses.map(c => c.year);
            return [...new Set(years)].sort((a, b) => b - a); // Sort descending
        } catch (error) {
            console.error('Error getting all years:', error);
            throw new Error('Failed to retrieve years');
        }
    }

    /**
     * Check if course has any assignments
     */
    static async courseHasAssignments(courseId: string): Promise<boolean> {
        try {
            // This would typically query the assignments table/file
            // For now, we'll import the AssignmentModel to check
            const { AssignmentModel } = await import('./Assignment');
            const assignments = await AssignmentModel.getAssignmentsByCourse(courseId);
            return assignments.length > 0;
        } catch (error) {
            console.error(`Error checking assignments for course ${courseId}:`, error);
            throw new Error('Failed to check course assignments');
        }
    }

    /**
     * Check if course has any notes
     */
    static async courseHasNotes(courseId: string): Promise<boolean> {
        try {
            // This would typically query the notes table/file
            // For now, we'll import the NoteModel to check
            const { NoteModel } = await import('./Note');
            const notes = await NoteModel.getNotesByCourse(courseId);
            return notes.length > 0;
        } catch (error) {
            console.error(`Error checking notes for course ${courseId}:`, error);
            throw new Error('Failed to check course notes');
        }
    }

    /**
     * Safe delete course (only if no assignments or notes exist)
     */
    static async safeDeleteCourse(id: string): Promise<{ success: boolean; message: string }> {
        try {
            const hasAssignments = await this.courseHasAssignments(id);
            const hasNotes = await this.courseHasNotes(id);
            
            if (hasAssignments || hasNotes) {
                return {
                    success: false,
                    message: 'Cannot delete course with existing assignments or notes. Please delete associated content first.'
                };
            }
            
            const deleted = await this.deleteCourse(id);
            
            if (!deleted) {
                return {
                    success: false,
                    message: 'Course not found'
                };
            }
            
            return {
                success: true,
                message: 'Course deleted successfully'
            };
        } catch (error) {
            console.error(`Error safely deleting course ${id}:`, error);
            throw new Error('Failed to safely delete course');
        }
    }
}