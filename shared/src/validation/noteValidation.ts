import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  content: z.string()
    .min(1, 'Content is required')
    .max(10000, 'Content must be less than 10,000 characters'),
  courseId: z.string()
    .min(1, 'Course ID must be provided')
    .optional(),
  assignmentId: z.string()
    .min(1, 'Assignment ID must be provided')
    .optional(),
  tags: z.array(z.string()
    .min(1, 'Tag cannot be empty')
    .max(50, 'Tag must be less than 50 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([])
});

export const createNoteSchema = noteSchema;

export const updateNoteSchema = noteSchema.partial();
export const validateCreateNote = (data: unknown) => {
  return createNoteSchema.safeParse(data);
};

export const validateUpdateNote = (data: unknown) => {
  return updateNoteSchema.safeParse(data);
};

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;