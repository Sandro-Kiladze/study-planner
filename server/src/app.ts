import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes'; // ✅ Local relative import to src/routes/index.ts
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// ✅ Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Study Planner API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      assignments: '/api/assignments',
      notes: '/api/notes',
      courses: '/api/courses',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
