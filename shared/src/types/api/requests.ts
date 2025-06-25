import { CreateAssignmentInput, UpdateAssignmentInput } from '../../validation/assignmentValidation';
import { CreateNoteInput, UpdateNoteInput } from '../../validation/noteValidation';
import { CreateCourseInput, UpdateCourseInput } from '../../validation/courseValidation';

export interface CreateAssignmentRequest extends CreateAssignmentInput {}
export interface UpdateAssignmentRequest extends Partial<UpdateAssignmentInput> {}


export interface CreateNoteRequest extends CreateNoteInput {}
export interface UpdateNoteRequest extends Partial<UpdateNoteInput> {}

export interface CreateCourseRequest extends CreateCourseInput {}
export interface UpdateCourseRequest extends Partial<UpdateCourseInput> {}

// Query parameters
export interface AssignmentFilters {
  courseId?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface NoteFilters {
  courseId?: string;
  assignmentId?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface CourseFilters {
  semester?: string;
  year?: number;
  search?: string;
  page?: number;
  limit?: number;
}