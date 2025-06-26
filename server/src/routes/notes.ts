import express from 'express';
import * as NoteModel from '../models/Note';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// GET /api/notes - list all notes with optional filtering
router.get('/', asyncHandler(async (req, res) => {
  const { courseId, assignmentId, tags } = req.query;
  let notes = await NoteModel.getAllNotes();
  
  if (courseId) {
    notes = notes.filter(n => n.courseId === courseId);
  }
  if (assignmentId) {
    notes = notes.filter(n => n.assignmentId === assignmentId);
  }
  if (tags) {
    const tagArray = (tags as string).split(',');
    notes = notes.filter(n =>
      tagArray.some(tag => n.tags.includes(tag.trim()))
    );
  }
  
  res.json(notes);
}));

// GET /api/notes/:id - get single note
router.get('/:id', asyncHandler(async (req, res) => {
  const note = await NoteModel.getNoteById(req.params.id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(note);
}));

// GET /api/notes/assignment/:assignmentId - get notes for assignment
router.get('/assignment/:assignmentId', asyncHandler(async (req, res) => {
  const notes = await NoteModel.getNotesByAssignment(req.params.assignmentId);
  res.json(notes);
}));

// POST /api/notes - create new note
router.post('/', asyncHandler(async (req, res) => {
  const note = await NoteModel.createNote(req.body);
  res.status(201).json(note);
}));

// PUT /api/notes/:id - update note
router.put('/:id', asyncHandler(async (req, res) => {
  const note = await NoteModel.updateNote(req.params.id, req.body);
  res.json(note);
}));

// DELETE /api/notes/:id - delete note
router.delete('/:id', asyncHandler(async (req, res) => {
  const success = await NoteModel.deleteNote(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.status(204).send();
}));

export default router;