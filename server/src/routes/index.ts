import express from 'express';
import assignmentRoutes from './assignments';
import noteRoutes from './notes';
import courseRoutes from './courses';
import cors from 'cors';

const router = express.Router();

router.use('/assignments', assignmentRoutes);
router.use('/notes', noteRoutes);
router.use('/courses', courseRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router; // ✅ THIS is what allows default import
