import React from 'react';
import { useNotes } from '../../hooks/useNotes';
import { useNavigate } from 'react-router-dom';

interface RelatedNotesProps {
  assignmentId: string;
  maxDisplay?: number;
}

const RelatedNotes: React.FC<RelatedNotesProps> = ({ assignmentId, maxDisplay = 3 }) => {
  const { notes } = useNotes();
  const navigate = useNavigate();
  
  const relatedNotes = notes.filter(note => note.assignmentId === assignmentId);
  const displayNotes = maxDisplay ? relatedNotes.slice(0, maxDisplay) : relatedNotes;
  const hasMore = relatedNotes.length > maxDisplay;

  const handleViewNote = (noteId: string) => {
    navigate(`/notes?view=${noteId}`);
  };

  const handleViewAll = () => {
    navigate(`/notes?assignment=${assignmentId}`);
  };

  if (relatedNotes.length === 0) {
    return (
      <div className="related-notes empty">
        <p>No notes for this assignment yet.</p>
      </div>
    );
  }

  return (
    <div className="related-notes">
      <h4>Related Notes ({relatedNotes.length})</h4>
      <div className="notes-preview">
        {displayNotes.map(note => (
          <div key={note.id} className="note-preview" onClick={() => handleViewNote(note.id)}>
            <div className="note-preview-title">{note.title}</div>
            <div className="note-preview-content">
              {note.content.substring(0, 100)}...
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button className="view-all-notes" onClick={handleViewAll}>
          View all {relatedNotes.length} notes
        </button>
      )}
    </div>
  );
};

export default RelatedNotes;