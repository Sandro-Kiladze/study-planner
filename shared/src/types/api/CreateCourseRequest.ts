import { Assignment, Note, Course } from '../../index';

export interface CreateCourseRequest {
  name: string;
  code: string;
  instructor?: string;
  color: string;
  semester: string;
  year: number;
}