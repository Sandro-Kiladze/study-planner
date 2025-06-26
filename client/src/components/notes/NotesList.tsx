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
  onDelete: (id: string) => void;
  onView: (note: Note) => void;
}

const NotesList: React.FC<NotesListProps> = ({
  courseFilter,
  assignmentFilter,
  searchTerm,
  sortBy = 'date',
  sortOrder = 'desc',
  onEdit,
  onDelete,
  onView
}) => {
  const { notes, loading, error, refetch } = useNotes();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  // Filtering and sorting logic
  const filteredAndSortedNotes = React.useMemo(() => {
    let filtered = notes;

    // Apply filters
    if (courseFilter) {
      filtered = filtered.filter(note => note.courseId === courseFilter);
    }
    
    if (assignmentFilter) {
      filtered = filtered.filter(note => note.assignmentId === assignmentFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
  }, [notes, courseFilter, assignmentFilter, searchTerm, sortBy, sortOrder]);

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
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default NotesList;