import type { Assignment } from '../../../shared/src/index';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileDb';
import path from 'path';


const ASSIGNMENTS_FILE = path.join(__dirname, '../data/assignments.json');

// Request types for creating and updating assignments
export interface CreateAssignmentRequest {
    title: string;
    description?: string;
    dueDate: string; // ISO date string
    courseId: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
}

export interface UpdateAssignmentRequest {
    title?: string;
    description?: string;
    dueDate?: string; // ISO date string
    courseId?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
}

export class AssignmentModel {
    /**
     * Get all assignments from the database
     */
    static async getAllAssignments(): Promise<Assignment[]> {
        try {
            const assignments = await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
            // Convert date strings back to Date objects
            return assignments.map(assignment => ({
                ...assignment,
                dueDate: new Date(assignment.dueDate),
                createdAt: new Date(assignment.createdAt),
                updatedAt: new Date(assignment.updatedAt)
            }));
        } catch (error) {
            console.error('Error getting all assignments:', error);
            throw new Error('Failed to retrieve assignments');
        }
    }

    /**
     * Get a single assignment by ID
     */
    static async getAssignmentById(id: string): Promise<Assignment | null> {
        try {
            const assignments = await this.getAllAssignments();
            const assignment = assignments.find(a => a.id === id);
            return assignment || null;
        } catch (error) {
            console.error(`Error getting assignment with id ${id}:`, error);
            throw new Error('Failed to retrieve assignment');
        }
    }

    /**
     * Create a new assignment
     */
    static async createAssignment(assignmentData: CreateAssignmentRequest): Promise<Assignment> {
        try {
            const assignments = await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
            
            const newAssignment: Assignment = {
                id: generateId(),
                title: assignmentData.title,
                description: assignmentData.description,
                dueDate: new Date(assignmentData.dueDate),
                courseId: assignmentData.courseId,
                status: assignmentData.status || 'pending',
                priority: assignmentData.priority || 'medium',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            assignments.push(newAssignment);
            await writeJsonFile(ASSIGNMENTS_FILE, assignments);
            
            return newAssignment;
        } catch (error) {
            console.error('Error creating assignment:', error);
            throw new Error('Failed to create assignment');
        }
    }

    /**
     * Update an existing assignment
     */
    static async updateAssignment(id: string, updates: UpdateAssignmentRequest): Promise<Assignment> {
        try {
            const assignments = await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
            const assignmentIndex = assignments.findIndex(a => a.id === id);
            
            if (assignmentIndex === -1) {
                throw new Error('Assignment not found');
            }

            const existingAssignment = assignments[assignmentIndex];
            const updatedAssignment: Assignment = {
                ...existingAssignment,
                ...updates,
                // Convert date string to Date object if provided
                dueDate: updates.dueDate ? new Date(updates.dueDate) : existingAssignment.dueDate,
                updatedAt: new Date()
            };

            assignments[assignmentIndex] = updatedAssignment;
            await writeJsonFile(ASSIGNMENTS_FILE, assignments);
            
            return updatedAssignment;
        } catch (error) {
            console.error(`Error updating assignment with id ${id}:`, error);
            throw new Error('Failed to update assignment');
        }
    }

    /**
     * Delete an assignment by ID
     */
    static async deleteAssignment(id: string): Promise<boolean> {
        try {
            const assignments = await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
            const initialLength = assignments.length;
            const filteredAssignments = assignments.filter(a => a.id !== id);
            
            if (filteredAssignments.length === initialLength) {
                return false; // Assignment not found
            }

            await writeJsonFile(ASSIGNMENTS_FILE, filteredAssignments);
            return true;
        } catch (error) {
            console.error(`Error deleting assignment with id ${id}:`, error);
            throw new Error('Failed to delete assignment');
        }
    }

    /**
     * Get assignments by course ID
     */
    static async getAssignmentsByCourse(courseId: string): Promise<Assignment[]> {
        try {
            const assignments = await this.getAllAssignments();
            return assignments.filter(a => a.courseId === courseId);
        } catch (error) {
            console.error(`Error getting assignments for course ${courseId}:`, error);
            throw new Error('Failed to retrieve assignments for course');
        }
    }

    /**
     * Get assignments by status
     */
    static async getAssignmentsByStatus(status: 'pending' | 'in-progress' | 'completed'): Promise<Assignment[]> {
        try {
            const assignments = await this.getAllAssignments();
            return assignments.filter(a => a.status === status);
        } catch (error) {
            console.error(`Error getting assignments with status ${status}:`, error);
            throw new Error('Failed to retrieve assignments by status');
        }
    }

    /**
     * Get assignments due within a date range
     */
    static async getAssignmentsByDateRange(startDate: Date, endDate: Date): Promise<Assignment[]> {
        try {
            const assignments = await this.getAllAssignments();
            return assignments.filter(a => 
                a.dueDate >= startDate && a.dueDate <= endDate
            );
        } catch (error) {
            console.error('Error getting assignments by date range:', error);
            throw new Error('Failed to retrieve assignments by date range');
        }
    }

    /**
     * Get overdue assignments
     */
    static async getOverdueAssignments(): Promise<Assignment[]> {
        try {
            const assignments = await this.getAllAssignments();
            const now = new Date();
            return assignments.filter(a => 
                a.dueDate < now && a.status !== 'completed'
            );
        } catch (error) {
            console.error('Error getting overdue assignments:', error);
            throw new Error('Failed to retrieve overdue assignments');
        }
    }
}