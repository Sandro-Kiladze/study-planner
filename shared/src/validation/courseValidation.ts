import { z } from 'zod';

export const courseSchema = z.object({
  name: z.string()
    .min(1, 'Course name is required')
    .max(100, 'Course name must be less than 100 characters'),
  code: z.string()
    .min(1, 'Course code is required')
    .max(20, 'Course code must be less than 20 characters')
    .regex(/^[A-Z0-9\-\s]+$/i, 'Course code can only contain letters, numbers, hyphens, and spaces'),
  instructor: z.string()
    .max(100, 'Instructor name must be less than 100 characters')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF5733)')
    .default('#3B82F6'),
  semester: z.enum(['Spring', 'Summer', 'Fall', 'Winter'], {
    required_error: 'Semester is required'
  }),
  year: z.number()
    .int('Year must be an integer')
    .min(2020, 'Year must be 2020 or later')
    .max(2030, 'Year must be 2030 or earlier')
});

export const createCourseSchema = courseSchema;

export const updateCourseSchema = courseSchema.partial();

export const validateCreateCourse = (data: unknown) => {
  return createCourseSchema.safeParse(data);
};

export const validateUpdateCourse = (data: unknown) => {
  return updateCourseSchema.safeParse(data);
};

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;