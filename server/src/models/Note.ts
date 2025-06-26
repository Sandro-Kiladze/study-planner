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

export class NoteModel {
    /**
     * Get all notes from the database
     */
    static async getAllNotes(): Promise<Note[]> {
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
    static async getNoteById(id: string): Promise<Note | null> {
        try {
            const notes = await this.getAllNotes();
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
    static async getNotesByAssignment(assignmentId: string): Promise<Note[]> {
        try {
            const notes = await this.getAllNotes();
            return notes.filter(n => n.assignmentId === assignmentId);
        } catch (error) {
            console.error(`Error getting notes for assignment ${assignmentId}:`, error);
            throw new Error('Failed to retrieve notes for assignment');
        }
    }

    /**
     * Get all notes associated with a specific course
     */
    static async getNotesByCourse(courseId: string): Promise<Note[]> {
        try {
            const notes = await this.getAllNotes();
            return notes.filter(n => n.courseId === courseId);
        } catch (error) {
            console.error(`Error getting notes for course ${courseId}:`, error);
            throw new Error('Failed to retrieve notes for course');
        }
    }

    /**
     * Create a new note
     */
    static async createNote(noteData: CreateNoteRequest): Promise<Note> {
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
    static async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
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
    static async deleteNote(id: string): Promise<boolean> {
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
    static async searchNotes(searchTerm: string): Promise<Note[]> {
        try {
            const notes = await this.getAllNotes();
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
    static async getNotesByTags(tags: string[]): Promise<Note[]> {
        try {
            const notes = await this.getAllNotes();
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
    static async getAllTags(): Promise<string[]> {
        try {
            const notes = await this.getAllNotes();
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
    static async deleteNotesByAssignment(assignmentId: string): Promise<number> {
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
    static async deleteNotesByCourse(courseId: string): Promise<number> {
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
}