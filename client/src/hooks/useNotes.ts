import { useCallback } from 'react';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../../shared/src';
import { noteService, NoteFilters } from '../services/noteService';
import { useApi } from './useApi';

export function useNotes(filters?: NoteFilters) {
  const apiCall = useCallback(() => noteService.getNotes(filters), [filters]);
  const { data, loading, error, refetch } = useApi<Note[]>(apiCall, [filters]);

  const notes = data || [];

  const createNote = async (noteData: CreateNoteRequest): Promise<Note> => {
    try {
      const newNote = await noteService.createNote(noteData);
      await refetch();
      return newNote;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create note');
    }
  };

  const updateNote = async (id: string, updates: UpdateNoteRequest): Promise<Note> => {
    try {
      const updatedNote = await noteService.updateNote(id, updates);
      await refetch();
      return updatedNote;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update note');
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      await noteService.deleteNote(id);
      await refetch();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  return {
    notes,
    loading,
    error,
    refetch,
    createNote,
    updateNote,
    deleteNote,
  };
}