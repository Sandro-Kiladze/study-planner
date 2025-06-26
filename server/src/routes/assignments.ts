import express from 'express';
import { Assignment, CreateAssignmentRequest, UpdateAssignmentRequest } from '../../../shared/src';
import * as AssignmentModel from '../models/Assignment';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// GET /api/assignments - list all assignments with optional filtering
router.get('/', asyncHandler(async (req, res) => {
  const { courseId, status, startDate, endDate } = req.query;
  let assignments = await AssignmentModel.getAllAssignments();
  
  // Apply filters if provided
  if (courseId) {
    assignments = assignments.filter(a => a.courseId === courseId);
  }
  if (status) {
    assignments = assignments.filter(a => a.status === status);
  }
  if (startDate || endDate) {
    assignments = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      if (startDate && dueDate < new Date(startDate as string)) return false;
      if (endDate && dueDate > new Date(endDate as string)) return false;
      return true;
    });
  }
  
  res.json(assignments);
}));

// GET /api/assignments/:id - get single assignment
router.get('/:id', asyncHandler(async (req, res) => {
  const assignment = await AssignmentModel.getAssignmentById(req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  res.json(assignment);
}));

// POST /api/assignments - create new assignment
router.post('/', asyncHandler(async (req, res) => {
  const assignment = await AssignmentModel.createAssignment(req.body);
  res.status(201).json(assignment);
}));

// PUT /api/assignments/:id - update assignment
router.put('/:id', asyncHandler(async (req, res) => {
  const assignment = await AssignmentModel.updateAssignment(req.params.id, req.body);
  res.json(assignment);
}));

// DELETE /api/assignments/:id - delete assignment
router.delete('/:id', asyncHandler(async (req, res) => {
  const success = await AssignmentModel.deleteAssignment(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  res.status(204).send();
}));

export default router;