import type { Course } from '../../../shared/src/index';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileDb';

const COURSES_FILE = 'courses.json';

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

/**
 * Get all courses from the database
 */
export const getAllCourses = async (): Promise<Course[]> => {
    try {
        console.log('📚 Attempting to read courses from:', COURSES_FILE);
        const courses = await readJsonFile<Course>(COURSES_FILE);
        console.log('✅ Successfully read courses:', courses.length, 'courses found');
        return courses;
    } catch (error) {
        console.error('❌ Error in getAllCourses:', error);
        throw error;
    }
};

/**
 * Get a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
    try {
        console.log(`🔍 Getting course by ID: ${id}`);
        const courses = await getAllCourses();
        const course = courses.find(c => c.id === id);
        console.log(course ? '✅ Course found' : '❌ Course not found');
        return course || null;
    } catch (error) {
        console.error(`❌ Error getting course with id ${id}:`, error);
        throw new Error('Failed to retrieve course');
    }
}

/**
 * Create a new course
 */
export async function createCourse(courseData: CreateCourseRequest): Promise<Course> {
    try {
        console.log('🆕 Creating new course with data:', courseData);
        
        // Validate required fields
        if (!courseData.name || !courseData.code || !courseData.semester || !courseData.year) {
            throw new Error('Missing required fields: name, code, semester, and year are required');
        }

        const courses = await readJsonFile<Course>(COURSES_FILE);
        console.log(`📚 Current courses count: ${courses.length}`);
        
        // Check if course code already exists for the same semester and year
        const existingCourse = courses.find(c => 
            c.code === courseData.code && 
            c.semester === courseData.semester && 
            c.year === courseData.year
        );
        
        if (existingCourse) {
            const errorMsg = `Course with code ${courseData.code} already exists for ${courseData.semester} ${courseData.year}`;
            console.error('❌', errorMsg);
            throw new Error(errorMsg);
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

        console.log('✅ New course object created:', newCourse);

        courses.push(newCourse);
        
        console.log('💾 Writing to file...');
        await writeJsonFile(COURSES_FILE, courses);
        console.log('🎉 Course saved successfully!');
        
        return newCourse;
    } catch (error) {
        console.error('❌ Error creating course:', error);
        throw error; // Re-throw to preserve the specific error message
    }
}

/**
 * Update an existing course
 */
export async function updateCourse(id: string, updates: UpdateCourseRequest): Promise<Course> {
    try {
        console.log(`🔄 Updating course ${id} with:`, updates);
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
        
        console.log('✅ Course updated successfully');
        return updatedCourse;
    } catch (error) {
        console.error(`❌ Error updating course with id ${id}:`, error);
        throw error; // Re-throw to preserve the specific error message
    }
}

/**
 * Delete a course by ID
 */
export async function deleteCourse(id: string): Promise<boolean> {
    try {
        console.log(`🗑️ Deleting course: ${id}`);
        const courses = await readJsonFile<Course>(COURSES_FILE);
        const initialLength = courses.length;
        const filteredCourses = courses.filter(c => c.id !== id);
        
        if (filteredCourses.length === initialLength) {
            console.log('❌ Course not found for deletion');
            return false; // Course not found
        }

        await writeJsonFile(COURSES_FILE, filteredCourses);
        console.log('✅ Course deleted successfully');
        return true;
    } catch (error) {
        console.error(`❌ Error deleting course with id ${id}:`, error);
        throw new Error('Failed to delete course');
    }
}

/**
 * Get courses by semester and year
 */
export async function getCoursesBySemester(semester: string, year: number): Promise<Course[]> {
    try {
        const courses = await getAllCourses();
        return courses.filter(c => c.semester === semester && c.year === year);
    } catch (error) {
        console.error(`Error getting courses for ${semester} ${year}:`, error);
        throw new Error('Failed to retrieve courses by semester');
    }
}

/**
 * Get courses by year
 */
export async function getCoursesByYear(year: number): Promise<Course[]> {
    try {
        const courses = await getAllCourses();
        return courses.filter(c => c.year === year);
    } catch (error) {
        console.error(`Error getting courses for year ${year}:`, error);
        throw new Error('Failed to retrieve courses by year');
    }
}

/**
 * Get course by code, semester, and year
 */
export async function getCourseByCode(code: string, semester: string, year: number): Promise<Course | null> {
    try {
        const courses = await getAllCourses();
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
export async function searchCourses(searchTerm: string): Promise<Course[]> {
    try {
        const courses = await getAllCourses();
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
export async function getAllSemesters(): Promise<string[]> {
    try {
        const courses = await getAllCourses();
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
export async function getAllYears(): Promise<number[]> {
    try {
        const courses = await getAllCourses();
        const years = courses.map(c => c.year);
        return [...new Set(years)].sort((a, b) => b - a); // Sort descending
    } catch (error) {
        console.error('Error getting all years:', error);
        throw new Error('Failed to retrieve years');
    }
}