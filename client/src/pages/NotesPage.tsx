import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Note } from '../../../shared/src/types/Note';
import { CreateNoteRequest } from '../../../shared/src/types/api/CreateNoteRequest';
import { UpdateNoteRequest } from '../../../shared/src/types/api/UpdateNoteRequest';
import { useNotes } from '../hooks/useNotes';
import NotesList from '../components/notes/NotesList';
import NotesFilters from '../components/notes/NotesFilters';
import NoteEditor from '../components/notes/NoteEditor';
import NoteView from '../components/notes/NoteView';
import ConfirmDialog from '../components/ConfirmDialog';
import '../styles/notes.css';


type ViewMode = 'list' | 'editor' | 'view';

const NotesPage: React.FC = () => {
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [searchParams] = useSearchParams();
  
  // Get URL parameters
  const preselectedAssignment = searchParams.get('assignment');
  const preselectedCourse = searchParams.get('course');
  const viewNoteId = searchParams.get('view');
  
  // State for view management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; noteId: string | null }>({
    show: false,
    noteId: null
  });

  useEffect(() => {
    // Handle pre-selected filters from URL
    if (preselectedCourse) {
      setCourseFilter(preselectedCourse);
    }
    
    // Handle view mode for specific note
    if (viewNoteId) {
      const noteToView = notes.find(n => n.id === viewNoteId);
      if (noteToView) {
        setSelectedNote(noteToView);
        setViewMode('view');
      }
    }
    
    // Handle auto-create for assignment
    if (preselectedAssignment)   if (selectedNote && viewMode === 'view') {
    const updatedNote = notes.find(n => n.id === selectedNote.id);
    if (updatedNote) {
      setSelectedNote(updatedNote);
    }
  }
  }, [preselectedCourse, preselectedAssignment, viewNoteId, notes, editingNote, viewMode]);

  const handleCreateNote = () => {
    setEditingNote(null);
    setViewMode('editor');
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setViewMode('editor');
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
    setViewMode('view');
  };

  const handleSaveNote = async (noteData: CreateNoteRequest | UpdateNoteRequest) => {
    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData as UpdateNoteRequest);
      } else {
        await createNote(noteData as CreateNoteRequest);
      }
      setViewMode('list');
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to save note:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setDeleteConfirm({ show: true, noteId });
  };

  const confirmDelete = async () => {
  if (deleteConfirm.noteId) {
    try {
      await deleteNote(deleteConfirm.noteId);
      setDeleteConfirm({ show: false, noteId: null });
      if (viewMode === 'view' && selectedNote?.id === deleteConfirm.noteId) {
        setViewMode('list');
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      //maybe add user feedback here ..
    }
  }
};

  const handleCancelEditor = () => {
    setViewMode('list');
    setEditingNote(null);
  };

  const handleCloseView = () => {
    setViewMode('list');
    setSelectedNote(null);
  };

  if (loading && notes.length === 0) {
    return <div>Loading notes...</div>;
  }

  return (
    <div className="notes-page">
      {viewMode === 'list' && (
        <>
          <div className="notes-page-header">
            <h1>My Notes</h1>
            <button className="create-note-btn" onClick={handleCreateNote}>
              + New Note
            </button>
          </div>

          <NotesFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            courseFilter={courseFilter}
            onCourseFilterChange={setCourseFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          <NotesList
            searchTerm={searchTerm}
            courseFilter={courseFilter}
            sortBy={sortBy as 'date' | 'title' | 'course'}
            sortOrder={sortOrder as 'asc' | 'desc'}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}  // This should now match the interface
            onView={handleViewNote}
        />
        </>
      )}

      {viewMode === 'editor' && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onCancel={handleCancelEditor}
          preselectedCourse={preselectedCourse || undefined}
          preselectedAssignment={preselectedAssignment || undefined}
        />
      )}

      {viewMode === 'view' && selectedNote && (
        <NoteView
          note={selectedNote}
          onEdit={() => handleEditNote(selectedNote)}
          onDelete={() => handleDeleteNote(selectedNote.id)}
          onClose={handleCloseView}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, noteId: null })}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
};

export default NotesPage;