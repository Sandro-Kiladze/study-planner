import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { useCourses } from '../hooks/useCourses';
import { useAssignments } from '../hooks/useAssignments';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import NotesFilters from '../components/NotesFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../../../study-planner/shared/src/index';
import './NotesPage.css';

interface NotesPageProps {
  assignmentId?: string; // For when accessed from assignment view
}

export const NotesPage: React.FC<NotesPageProps> = ({ assignmentId }) => {
  // Hooks for data management
  const { 
    notes, 
    loading: notesLoading, 
    error: notesError, 
    createNote, 
    updateNote, 
    deleteNote,
    refetch // Changed from refreshNotes
  } = useNotes();
  
  const { courses, loading: coursesLoading } = useCourses();
  const { assignments, loading: assignmentsLoading } = useAssignments();

  // Local state for UI management
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteConfirmNote, setDeleteConfirmNote] = useState<Note | null>(null);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(assignmentId || '');
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();

  // Filter notes based on current filters
  useEffect(() => {
    let filtered = notes;

    // Filter by assignment if viewing from assignment page
    if (assignmentId) {
      filtered = filtered.filter(note => note.assignmentId === assignmentId);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply course filter
    if (selectedCourseId) {
      filtered = filtered.filter(note => note.courseId === selectedCourseId);
    }

    // Apply assignment filter
    if (selectedAssignmentId && !assignmentId) {
      filtered = filtered.filter(note => note.assignmentId === selectedAssignmentId);
    }

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedCourseId, selectedAssignmentId, assignmentId]);

  // Handle creating a new note
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  // Handle editing an existing note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  // Handle saving a note (create or update)
  const handleSaveNote = async (noteData: CreateNoteRequest | UpdateNoteRequest) => {
    try {
      if (editingNote) {
        // Update existing note
        await updateNote(editingNote.id, noteData as UpdateNoteRequest);
      } else {
        // Create new note
        const createData: CreateNoteRequest = {
          ...noteData as CreateNoteRequest,
          assignmentId: assignmentId || (noteData as CreateNoteRequest).assignmentId
        };
        await createNote(createData);
      }
      setIsEditorOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      setDeleteConfirmNote(noteToDelete);
    }
  };

  // Confirm note deletion
  const confirmDeleteNote = async () => {
    if (deleteConfirmNote) {
      try {
        await deleteNote(deleteConfirmNote.id);
        setDeleteConfirmNote(null);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  // Handle filter changes
  const handleFiltersChange = (filters: {
    search: string;
    courseId: string;
    assignmentId: string;
  }) => {
    setSearchTerm(filters.search);
    setSelectedCourseId(filters.courseId);
    setSelectedAssignmentId(filters.assignmentId);
  };

  // Handle note selection
  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id);
  };

  // Get all unique tags from notes
  const availableTags = Array.from(
    new Set(notes.flatMap((note: Note) => note.tags))
    ).sort() as string[];
  // Loading state
  if (notesLoading || coursesLoading || assignmentsLoading) {
    return (
      <div className="notes-page">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (notesError) {
    return (
      <div className="notes-page">
        <ErrorMessage 
          error={notesError}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="notes-page__header">
        <h1>{assignmentId ? 'Assignment Notes' : 'Notes'}</h1>
        <button 
          className="btn btn--primary"
          onClick={handleCreateNote}
        >
          Add New Note
        </button>
      </div>

      {!assignmentId && (
        <NotesFilters
          courses={courses}
          onFilterChange={(filters) => handleFiltersChange({
            search: filters.search,
            courseId: filters.courseId,
            assignmentId: selectedAssignmentId
          })}
          availableTags={availableTags}
        />
      )}

      <div className="notes-page__content">
        <NotesList
          notes={filteredNotes}
          courses={courses}
          assignments={assignments}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
          onSelectNote={handleSelectNote}
          selectedNoteId={selectedNoteId}
        />
      </div>

      {isEditorOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <NoteEditor
              note={editingNote || undefined}
              courses={courses}
              assignments={assignments}
              onSave={handleSaveNote}
              onCancel={() => {
                setIsEditorOpen(false);
                setEditingNote(null);
              }}
            />
          </div>
        </div>
      )}

      {deleteConfirmNote && (
        <ConfirmDialog
          isOpen={!!deleteConfirmNote}
          title="Delete Note"
          message={`Are you sure you want to delete "${deleteConfirmNote.title}"? This action cannot be undone.`}
          onConfirm={confirmDeleteNote}
          onCancel={() => setDeleteConfirmNote(null)}
        />
      )}
    </div>
  );
};