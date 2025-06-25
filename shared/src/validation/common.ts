import { z } from 'zod';

export const idSchema = z.string().uuid('Invalid ID format');

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});

export const dateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

export const assignmentFilterSchema = z.object({
  courseId: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  search: z.string().optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

export const noteFilterSchema = z.object({
  courseId: z.string().optional(),
  assignmentId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional()
});

export const createValidationMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      return {
        isValid: false,
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
    return {
      isValid: true,
      data: result.data,
      errors: []
    };
  };
};