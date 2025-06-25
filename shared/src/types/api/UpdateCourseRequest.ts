import { Assignment, Note, Course } from '../../index';

export interface UpdateCourseRequest {
  name?: string;
  code?: string;
  instructor?: string;
  color?: string;
  semester?: string;
  year?: number;
}