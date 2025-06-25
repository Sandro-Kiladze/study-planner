import { z } from 'zod';

export const assignmentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  dueDate: z.date({
    required_error: 'Due date is required',
    invalid_type_error: 'Due date must be a valid date'
  }),
  courseId: z.string()
    .min(1, 'Course is required'),
  status: z.enum(['pending', 'in-progress', 'completed'], {
    required_error: 'Status is required'
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required'
  })
});

export const createAssignmentSchema = assignmentSchema;


export const updateAssignmentSchema = assignmentSchema.partial();


export const validateCreateAssignment = (data: unknown) => {
  return createAssignmentSchema.safeParse(data);
};

export const validateUpdateAssignment = (data: unknown) => {
  return updateAssignmentSchema.safeParse(data);
};

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;