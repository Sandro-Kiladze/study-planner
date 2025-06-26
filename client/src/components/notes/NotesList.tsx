import React from 'react';
import { Note } from '../../../../shared/src/types/Note';
import { useNotes } from '../../hooks/useNotes';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import NoteCard from './NoteCard';

interface NotesListProps {
  courseFilter?: string;
  assignmentFilter?: string;
  searchTerm?: string;
  sortBy?: 'date' | 'title' | 'course';
  sortOrder?: 'asc' | 'desc';
  onEdit: (note: Note) => void;
  onView: (note: Note) => void;
  onDelete: (id: string) => void; 
}

const NotesList: React.FC<NotesListProps> = ({
  courseFilter,
  assignmentFilter,
  searchTerm,
  sortBy = 'date',
  sortOrder = 'desc',
  onEdit,
  onView,
  onDelete
}) => {
  // Use the useNotes hook with all its methods
  const { notes, loading, error, deleteNote, refetch } = useNotes();

  // Handle delete operation
  const handleDelete = async (id: string) => {
    try {
      await deleteNote(id);
      // No need to manually refetch - the useNotes hook should handle this
    } catch (err) {
      console.error('Failed to delete note:', err);
      // You might want to show an error notification here
    }
  };

  // Memoized filtering and sorting - now handles all hook calls before any returns
  const filteredAndSortedNotes = React.useMemo(() => {
    if (loading || error) return [];

    let filtered = [...notes]; // Create a copy to avoid mutating the original array

    // Apply filters
    if (courseFilter) {
      filtered = filtered.filter(note => note.courseId === courseFilter);
    }
    
    if (assignmentFilter) {
      filtered = filtered.filter(note => note.assignmentId === assignmentFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        (note.tags || []).some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'course':
          comparison = (a.courseId || '').localeCompare(b.courseId || '');
          break;
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [notes, courseFilter, assignmentFilter, searchTerm, sortBy, sortOrder, loading, error]);

  // Conditional rendering after all hooks
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (filteredAndSortedNotes.length === 0) {
    return (
      <div className="notes-list-empty">
        <p>No notes found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {filteredAndSortedNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => handleDelete(note.id)}
          onView={() => onView(note)}
        />
      ))}
    </div>
  );
};

export default NotesList;