import { readJsonFile, writeJsonFile } from '../utils/fileDb';
import { v4 as uuidv4 } from 'uuid';

// You'll need to install uuid: npm install uuid @types/uuid

interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  courseId: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

interface CreateAssignmentRequest {
  title: string;
  description?: string;
  dueDate: string;
  courseId: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  courseId?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

const ASSIGNMENTS_FILE = 'assignments.json';

export const getAllAssignments = async (): Promise<Assignment[]> => {
  try {
    return await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

export const getAssignmentById = async (id: string): Promise<Assignment | null> => {
  const assignments = await getAllAssignments();
  return assignments.find(assignment => assignment.id === id) || null;
};

export const createAssignment = async (assignmentData: CreateAssignmentRequest): Promise<Assignment> => {
  const assignments = await getAllAssignments();
  
  const newAssignment: Assignment = {
    id: uuidv4(),
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
};

export const updateAssignment = async (id: string, updates: UpdateAssignmentRequest): Promise<Assignment> => {
  const assignments = await getAllAssignments();
  const assignmentIndex = assignments.findIndex(assignment => assignment.id === id);
  
  if (assignmentIndex === -1) {
    throw new Error('Assignment not found');
  }
  
  const existingAssignment = assignments[assignmentIndex];
  const updatedAssignment: Assignment = {
    ...existingAssignment,
    ...updates,
    dueDate: updates.dueDate ? new Date(updates.dueDate) : existingAssignment.dueDate,
    updatedAt: new Date()
  };
  
  assignments[assignmentIndex] = updatedAssignment;
  await writeJsonFile(ASSIGNMENTS_FILE, assignments);
  
  return updatedAssignment;
};

export const deleteAssignment = async (id: string): Promise<boolean> => {
  const assignments = await getAllAssignments();
  const filteredAssignments = assignments.filter(assignment => assignment.id !== id);
  
  if (filteredAssignments.length === assignments.length) {
    return false; // Assignment not found
  }
  
  await writeJsonFile(ASSIGNMENTS_FILE, filteredAssignments);
  return true;
};