import express from 'express';
import assignmentRoutes from './assignments';
import noteRoutes from './notes';
import courseRoutes from './courses';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount route modules
router.use('/assignments', assignmentRoutes);
router.use('/notes', noteRoutes);
router.use('/courses', courseRoutes);

export default router;