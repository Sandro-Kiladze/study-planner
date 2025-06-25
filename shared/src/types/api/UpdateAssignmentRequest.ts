import { Assignment, Note, Course } from '../../index';

export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  courseId?: string;
  status?: Assignment['status'];
  priority?: Assignment['priority'];
}