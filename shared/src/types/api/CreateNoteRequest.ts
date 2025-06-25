import { Assignment, Note, Course } from '../../index';


export interface CreateNoteRequest {
  title: string;
  content: string;
  courseId?: string;
  assignmentId?: string;
  tags?: string[];
}