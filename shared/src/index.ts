export type { Assignment } from './types/Assignment';
export type { Note } from './types/Note';
export type { Course } from './types/Course';



export * from './types/api/requests';   
export * from './types/api/responses';


export * from './validation/assignmentValidation';
export * from './validation/noteValidation';
export * from './validation/courseValidation';
export * from './validation/common';    

export type { CreateAssignmentRequest } from './types/api/CreateAssignmentRequest'; 
export type { UpdateAssignmentRequest } from './types/api/UpdateAssignmentRequest';

export type { CreateCourseRequest } from './types/api/CreateCourseRequest';
export type { UpdateCourseRequest } from './types/api/UpdateCourseRequest'; 

export type { CreateNoteRequest } from './types/api/CreateNoteRequest';
export type { UpdateNoteRequest } from './types/api/UpdateNoteRequest';
             
// export type { ApiResponse } from './types/api/response';