import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './NotesList.css';
import NotesFilters, { NotesFiltersProps, Course, NotesFiltersState, SortByOption, SortOrder } from './NotesFilters';

import { Note } from '../../../../study-planner/shared/src/index';

interface NotesListProps {
  notes: Note[];
  courses: Course[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onSelectNote: (note: Note) => void;
  selectedNoteId?: string;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  courses,
  onEditNote,
  onDeleteNote,
  onSelectNote,
  selectedNoteId
}) => {
  const [filters, setFilters] = useState<NotesFiltersState>({
    search: '',
    courseId: '',
    tags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // Get all unique tags from notes
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!note.title.toLowerCase().includes(search) && 
            !note.content.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Course filter
      if (filters.courseId && note.courseId !== filters.courseId) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        if (!filters.tags.some(tag => note.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    });

    // Sort notes
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [notes, filters]);

  const getCourseInfo = (courseId?: string) => {
    if (!courseId) return null;
    return courses.find(course => course.id === courseId);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="notes-list-container">
      <NotesFilters
        courses={courses}
        onFilterChange={setFilters}
        availableTags={availableTags}
      />

      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p>No notes found matching your criteria.</p>
            <p>Try adjusting your filters or create a new note.</p>
          </div>
        ) : (
          filteredNotes.map(note => {
            const course = getCourseInfo(note.courseId);
            const isSelected = note.id === selectedNoteId;

            return (
              <div
                key={note.id}
                className={`note-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectNote(note)}
              >
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <div className="note-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNote(note);
                      }}
                      className="edit-btn"
                      title="Edit Note"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this note?')) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="delete-btn"
                      title="Delete Note"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="note-meta">
                  {course && (
                    <div className="course-info">
                      <span 
                        className="course-badge"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code}
                      </span>
                    </div>
                  )}
                  <span className="note-date">
                    Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </span>
                </div>

                <div className="note-preview">
                  {truncateContent(note.content)}
                </div>

                {note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {note.assignmentId && (
                  <div className="assignment-link">
                    📋 Linked to assignment
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotesList;