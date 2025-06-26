// client/src/services/noteService.ts
import apiClient from './api';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../../shared/src';

export interface NoteFilters {
  courseId?: string;
  assignmentId?: string;
  tags?: string[];
}

export const noteService = {
  async getNotes(filters?: NoteFilters): Promise<Note[]> {
    try {
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
      
      const queryString = params.toString();
      const url = queryString ? `/notes?${queryString}` : 'api/notes';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  async getNote(id: string): Promise<Note> {
    try {
      const response = await apiClient.get(`api/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw error;
    }
  },

  async getNotesByAssignment(assignmentId: string): Promise<Note[]> {
    try {
      // Fixed: Consistent URL pattern (removed /api prefix since it's in baseURL)
      const response = await apiClient.get(`api/notes/assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes by assignment:', error);
      throw error;
    }
  },

  async createNote(note: CreateNoteRequest): Promise<Note> {
    try {
      const response = await apiClient.post('api/notes', note);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  async updateNote(id: string, updates: UpdateNoteRequest): Promise<Note> {
    try {
      const response = await apiClient.put(`api/notes/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw error;
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await apiClient.delete(`api/notes/${id}`);
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw error;
    }
  },
};