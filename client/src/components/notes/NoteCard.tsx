import React from 'react';
import { Note } from '../../../../shared/src/types/Note';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onView: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onView }) => {
  const contentPreview = note.content.substring(0, 150) + (note.content.length > 150 ? '...' : '');

  return (
    <div className="note-card" onClick={() => onView(note)}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions">
          <button onClick={(e) => { e.stopPropagation(); onEdit(note); }}>
            Edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}>
            Delete
          </button>
        </div>
      </div>
      
      <div className="note-content-preview">
        {contentPreview}
      </div>
      
      <div className="note-footer">
        <div className="note-tags">
          {note.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <div className="note-meta">
          <span className="note-date">
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;