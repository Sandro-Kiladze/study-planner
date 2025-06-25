import { Assignment, Note, Course } from '../../index';

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  courseId?: string;
  assignmentId?: string;
  tags?: string[];
}