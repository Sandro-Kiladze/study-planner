export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const ASSIGNMENT_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const COURSE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
] as const;

export const ROUTES = {
  HOME: '/',
  ASSIGNMENTS: '/assignments',
  NOTES: '/notes',
  COURSES: '/courses',
} as const;

export const API_ENDPOINTS = {
  ASSIGNMENTS: '/assignments',
  NOTES: '/notes',
  COURSES: '/courses',
  HEALTH: '/health',
} as const;