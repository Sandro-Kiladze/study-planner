import express from 'express';
import * as CourseModel from '../models/Course';
import * as AssignmentModel from '../models/Assignment';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// GET /api/courses - list all courses
router.get('/', asyncHandler(async (req, res) => {
  const courses = await CourseModel.getAllCourses();
  res.json(courses);
}));

// GET /api/courses/:id - get single course
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await CourseModel.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
}));

// POST /api/courses - create new course
router.post('/', asyncHandler(async (req, res) => {
  const course = await CourseModel.createCourse(req.body);
  res.status(201).json(course);
}));

// PUT /api/courses/:id - update course
router.put('/:id', asyncHandler(async (req, res) => {
  const course = await CourseModel.updateCourse(req.params.id, req.body);
  res.json(course);
}));

// DELETE /api/courses/:id - delete course
router.delete('/:id', asyncHandler(async (req, res) => {
  // Check if course has existing assignments
  const assignments = await AssignmentModel.getAllAssignments();
  const hasAssignments = assignments.some(a => a.courseId === req.params.id);
  
  if (hasAssignments) {
    return res.status(400).json({
      error: 'Cannot delete course with existing assignments'
    });
  }
  
  const success = await CourseModel.deleteCourse(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.status(204).send();
}));

export default router;