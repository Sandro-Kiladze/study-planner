import { Assignment, Course, Note } from '../../shared/src/index';
import { writeJsonFile, readJsonFile } from './utils/fileDb';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_DIR = path.join(__dirname, '../data');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

// Sample data
const sampleCourses: Course[] = [
  {
    id: 'course-1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    instructor: 'Dr. Smith',
    color: '#3B82F6',
    semester: 'Fall',
    year: 2024
  },
  {
    id: 'course-2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    instructor: 'Prof. Johnson',
    color: '#10B981',
    semester: 'Fall',
    year: 2024
  },
  {
    id: 'course-3',
    name: 'Database Systems',
    code: 'CS301',
    instructor: 'Dr. Williams',
    color: '#F59E0B',
    semester: 'Fall',
    year: 2024
  }
];

const sampleAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    title: 'Basic Programming Concepts',
    description: 'Complete exercises on variables, loops, and functions',
    dueDate: new Date('2024-12-15'),
    courseId: 'course-1',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: 'assignment-2',
    title: 'Binary Search Tree Implementation',
    description: 'Implement a BST with insertion, deletion, and traversal methods',
    dueDate: new Date('2024-12-20'),
    courseId: 'course-2',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-10')
  },
  {
    id: 'assignment-3',
    title: 'Database Design Project',
    description: 'Design and implement a normalized database schema',
    dueDate: new Date('2024-12-25'),
    courseId: 'course-3',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2024-11-08'),
    updatedAt: new Date('2024-11-08')
  },
  {
    id: 'assignment-4',
    title: 'Algorithm Analysis Report',
    description: 'Write a report analyzing time complexity of sorting algorithms',
    dueDate: new Date('2024-12-10'),
    courseId: 'course-2',
    status: 'completed',
    priority: 'low',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-11-12')
  }
];

const sampleNotes: Note[] = [
  {
    id: 'note-1',
    title: 'CS101 - Week 1 Notes',
    content: 'Introduction to programming fundamentals. Covered variables, data types, and basic syntax.',
    courseId: 'course-1',
    assignmentId: 'assignment-1',
    tags: ['programming', 'basics', 'variables'],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: 'note-2',
    title: 'Binary Trees Overview',
    content: 'Binary trees are hierarchical data structures. Each node has at most two children: left and right.',
    courseId: 'course-2',
    assignmentId: 'assignment-2',
    tags: ['data-structures', 'trees', 'algorithms'],
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05')
  },
  {
    id: 'note-3',
    title: 'Database Normalization Rules',
    content: 'First Normal Form (1NF): Eliminate repeating groups. Second Normal Form (2NF): Eliminate partial dependencies.',
    courseId: 'course-3',
    assignmentId: 'assignment-3',
    tags: ['database', 'normalization', 'design'],
    createdAt: new Date('2024-11-08'),
    updatedAt: new Date('2024-11-08')
  },
  {
    id: 'note-4',
    title: 'Big O Notation Cheat Sheet',
    content: 'O(1) - Constant, O(log n) - Logarithmic, O(n) - Linear, O(n²) - Quadratic',
    courseId: 'course-2',
    tags: ['algorithms', 'complexity', 'big-o'],
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20')
  }
];

/**
 * Ensures the data directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('Created data directory:', DATA_DIR);
  }
}

/**
 * Checks if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates data before saving to files
 */
function validateAssignment(assignment: Assignment): boolean {
  return !!(
    assignment.id &&
    assignment.title &&
    assignment.dueDate &&
    assignment.courseId &&
    assignment.status &&
    assignment.priority
  );
}

function validateCourse(course: Course): boolean {
  return !!(
    course.id &&
    course.name &&
    course.code &&
    course.color &&
    course.semester &&
    course.year
  );
}

function validateNote(note: Note): boolean {
  return !!(
    note.id &&
    note.title &&
    note.content &&
    Array.isArray(note.tags)
  );
}

/**
 * Initializes database files if they don't exist
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await ensureDataDirectory();

    // Initialize courses file
    if (!(await fileExists(COURSES_FILE))) {
      await writeJsonFile(COURSES_FILE, []);
      console.log('Initialized courses.json');
    }

    // Initialize assignments file
    if (!(await fileExists(ASSIGNMENTS_FILE))) {
      await writeJsonFile(ASSIGNMENTS_FILE, []);
      console.log('Initialized assignments.json');
    }

    // Initialize notes file
    if (!(await fileExists(NOTES_FILE))) {
      await writeJsonFile(NOTES_FILE, []);
      console.log('Initialized notes.json');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Seeds the database with sample data
 */
export async function seedDatabase(): Promise<void> {
  try {
    await initializeDatabase();

    // Check if data already exists
    const existingCourses = await readJsonFile<Course>(COURSES_FILE);
    const existingAssignments = await readJsonFile<Assignment>(ASSIGNMENTS_FILE);
    const existingNotes = await readJsonFile<Note>(NOTES_FILE);

    // Only seed if files are empty
    if (existingCourses.length === 0) {
      // Validate courses before seeding
      const validCourses = sampleCourses.filter(validateCourse);
      if (validCourses.length !== sampleCourses.length) {
        console.warn('Some sample courses failed validation');
      }
      
      await writeJsonFile(COURSES_FILE, validCourses);
      console.log(`Seeded ${validCourses.length} courses`);
    }

    if (existingAssignments.length === 0) {
      // Validate assignments before seeding
      const validAssignments = sampleAssignments.filter(validateAssignment);
      if (validAssignments.length !== sampleAssignments.length) {
        console.warn('Some sample assignments failed validation');
      }
      
      await writeJsonFile(ASSIGNMENTS_FILE, validAssignments);
      console.log(`Seeded ${validAssignments.length} assignments`);
    }

    if (existingNotes.length === 0) {
      // Validate notes before seeding
      const validNotes = sampleNotes.filter(validateNote);
      if (validNotes.length !== sampleNotes.length) {
        console.warn('Some sample notes failed validation');
      }
      
      await writeJsonFile(NOTES_FILE, validNotes);
      console.log(`Seeded ${validNotes.length} notes`);
    }

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Resets the database by clearing all data files
 */
export async function resetDatabase(): Promise<void> {
  try {
    await ensureDataDirectory();
    
    await writeJsonFile(COURSES_FILE, []);
    await writeJsonFile(ASSIGNMENTS_FILE, []);
    await writeJsonFile(NOTES_FILE, []);
    
    console.log('Database reset completed');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

/**
 * Resets and reseeds the database
 */
export async function resetAndSeedDatabase(): Promise<void> {
  await resetDatabase();
  await seedDatabase();
}

// Export file paths for use in models
export { ASSIGNMENTS_FILE, COURSES_FILE, NOTES_FILE };