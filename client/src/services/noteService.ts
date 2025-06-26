import apiClient from './api';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../../shared/src';

export interface NoteFilters {
  courseId?: string;
  assignmentId?: string;
  tags?: string[];
}

export const noteService = {
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value);
          }
        }
      });
    }
    
    const response = await apiClient.get(`/notes?${params.toString()}`);
    return response.data;
  },

  async getNote(id: string): Promise<Note> {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  async getNotesByAssignment(assignmentId: string): Promise<Note[]> {
    const response = await apiClient.get(`/notes/assignment/${assignmentId}`);
    return response.data;
  },

  async createNote(note: CreateNoteRequest): Promise<Note> {
    const response = await apiClient.post('/notes', note);
    return response.data;
  },

  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    const response = await apiClient.put(`/notes/${id}`, updates);
    return response.data;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  },
};