import type { Note } from '../../../shared/src/index';
import { readJsonFile, writeJsonFile, generateId } from '../utils/fileDb';
import path from 'path';

const NOTES_FILE = path.join(__dirname, '../data/notes.json');

export interface CreateNoteRequest {
    title: string;
    content: string;
    courseId?: string;
    assignmentId?: string;
    tags?: string[];
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
    courseId?: string;
    assignmentId?: string;
    tags?: string[];
}

/**
 * Get all notes from the database
 */
export async function getAllNotes(): Promise<Note[]> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        // Convert date strings back to Date objects
        return notes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
        }));
    } catch (error) {
        console.error('Error getting all notes:', error);
        throw new Error('Failed to retrieve notes');
    }
}

/**
 * Get a single note by ID
 */
export async function getNoteById(id: string): Promise<Note | null> {
    try {
        const notes = await getAllNotes();
        const note = notes.find(n => n.id === id);
        return note || null;
    } catch (error) {
        console.error(`Error getting note with id ${id}:`, error);
        throw new Error('Failed to retrieve note');
    }
}

/**
 * Get all notes associated with a specific assignment
 */
export async function getNotesByAssignment(assignmentId: string): Promise<Note[]> {
    try {
        const notes = await getAllNotes();
        return notes.filter(n => n.assignmentId === assignmentId);
    } catch (error) {
        console.error(`Error getting notes for assignment ${assignmentId}:`, error);
        throw new Error('Failed to retrieve notes for assignment');
    }
}

/**
 * Get all notes associated with a specific course
 */
export async function getNotesByCourse(courseId: string): Promise<Note[]> {
    try {
        const notes = await getAllNotes();
        return notes.filter(n => n.courseId === courseId);
    } catch (error) {
        console.error(`Error getting notes for course ${courseId}:`, error);
        throw new Error('Failed to retrieve notes for course');
    }
}

/**
 * Create a new note
 */
export async function createNote(noteData: CreateNoteRequest): Promise<Note> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        
        const newNote: Note = {
            id: generateId(),
            title: noteData.title,
            content: noteData.content,
            courseId: noteData.courseId,
            assignmentId: noteData.assignmentId,
            tags: noteData.tags || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        notes.push(newNote);
        await writeJsonFile(NOTES_FILE, notes);
        
        return newNote;
    } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to create note');
    }
}

/**
 * Update an existing note
 */
export async function updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        const noteIndex = notes.findIndex(n => n.id === id);
        
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }

        const existingNote = notes[noteIndex];
        const updatedNote: Note = {
            ...existingNote,
            ...updates,
            updatedAt: new Date()
        };

        notes[noteIndex] = updatedNote;
        await writeJsonFile(NOTES_FILE, notes);
        
        return updatedNote;
    } catch (error) {
        console.error(`Error updating note with id ${id}:`, error);
        throw new Error('Failed to update note');
    }
}

/**
 * Delete a note by ID
 */
export async function deleteNote(id: string): Promise<boolean> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        const initialLength = notes.length;
        const filteredNotes = notes.filter(n => n.id !== id);
        
        if (filteredNotes.length === initialLength) {
            return false; // Note not found
        }

        await writeJsonFile(NOTES_FILE, filteredNotes);
        return true;
    } catch (error) {
        console.error(`Error deleting note with id ${id}:`, error);
        throw new Error('Failed to delete note');
    }
}

/**
 * Search notes by title or content
 */
export async function searchNotes(searchTerm: string): Promise<Note[]> {
    try {
        const notes = await getAllNotes();
        const lowercaseSearch = searchTerm.toLowerCase();
        
        return notes.filter(note => 
            note.title.toLowerCase().includes(lowercaseSearch) ||
            note.content.toLowerCase().includes(lowercaseSearch) ||
            note.tags.some(tag => tag.toLowerCase().includes(lowercaseSearch))
        );
    } catch (error) {
        console.error('Error searching notes:', error);
        throw new Error('Failed to search notes');
    }
}

/**
 * Get notes by tags
 */
export async function getNotesByTags(tags: string[]): Promise<Note[]> {
    try {
        const notes = await getAllNotes();
        return notes.filter(note => 
            tags.some(tag => note.tags.includes(tag))
        );
    } catch (error) {
        console.error('Error getting notes by tags:', error);
        throw new Error('Failed to retrieve notes by tags');
    }
}

/**
 * Get all unique tags from all notes
 */
export async function getAllTags(): Promise<string[]> {
    try {
        const notes = await getAllNotes();
        const allTags = notes.flatMap(note => note.tags);
        return [...new Set(allTags)].sort();
    } catch (error) {
        console.error('Error getting all tags:', error);
        throw new Error('Failed to retrieve tags');
    }
}

/**
 * Delete all notes associated with an assignment
 */
export async function deleteNotesByAssignment(assignmentId: string): Promise<number> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        const initialLength = notes.length;
        const filteredNotes = notes.filter(n => n.assignmentId !== assignmentId);
        
        const deletedCount = initialLength - filteredNotes.length;
        
        if (deletedCount > 0) {
            await writeJsonFile(NOTES_FILE, filteredNotes);
        }
        
        return deletedCount;
    } catch (error) {
        console.error(`Error deleting notes for assignment ${assignmentId}:`, error);
        throw new Error('Failed to delete notes for assignment');
    }
}

/**
 * Delete all notes associated with a course
 */
export async function deleteNotesByCourse(courseId: string): Promise<number> {
    try {
        const notes = await readJsonFile<Note>(NOTES_FILE);
        const initialLength = notes.length;
        const filteredNotes = notes.filter(n => n.courseId !== courseId);
        
        const deletedCount = initialLength - filteredNotes.length;
        
        if (deletedCount > 0) {
            await writeJsonFile(NOTES_FILE, filteredNotes);
        }
        
        return deletedCount;
    } catch (error) {
        console.error(`Error deleting notes for course ${courseId}:`, error);
        throw new Error('Failed to delete notes for course');
    }
}