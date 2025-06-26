import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from '../../../study-planner/server/src/routes';
import { errorHandler } from '../../../study-planner/server/src/middleware/errorHandler';
import { notFound } from '../../../study-planner/server/src/middleware/notFound';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Study Planner API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      assignments: '/api/assignments',
      notes: '/api/notes',
      courses: '/api/courses'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;