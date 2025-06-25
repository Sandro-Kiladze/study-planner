import { Assignment, Note, Course } from '../../index';

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  dueDate: Date;
  courseId: string;
  priority: Assignment['priority'];
}