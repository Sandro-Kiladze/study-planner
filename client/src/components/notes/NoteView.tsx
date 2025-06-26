import '../../styles/NoteView.css';
import React from 'react';
import { Note } from '../../../../shared/src/types/Note';
import { format } from 'date-fns';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';

interface NoteViewProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const NoteView: React.FC<NoteViewProps> = ({ note, onEdit, onDelete, onClose }) => {
  const { courses } = useCourses();
  const { assignments } = useAssignments();
  
  const associatedCourse = note.courseId ? courses.find(c => c.id === note.courseId) : null;
  const associatedAssignment = note.assignmentId ? assignments.find(a => a.id === note.assignmentId) : null;

  const handleExport = () => {
    const blob = new Blob([`# ${note.title}\n\n${note.content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="note-view">
      <div className="note-view-header">
        <div className="note-title-section">
          <h1>{note.title}</h1>
          <div className="note-metadata">
            <span className="creation-date">
              Created: {format(new Date(note.createdAt), 'PPP')}
            </span>
            {note.updatedAt !== note.createdAt && (
              <span className="modified-date">
                Modified: {format(new Date(note.updatedAt), 'PPP')}
              </span>
            )}
          </div>
        </div>
        
        <div className="note-actions">
          <button onClick={handleExport}>Export</button>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete} className="delete-btn">Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      <div className="note-associations">
        {associatedCourse && (
          <div className="association">
            <strong>Course:</strong> 
            <span className="course-badge" style={{ backgroundColor: associatedCourse.color }}>
              {associatedCourse.name}
            </span>
          </div>
        )}
        
        {associatedAssignment && (
          <div className="association">
            <strong>Assignment:</strong> 
            <span className="assignment-link">{associatedAssignment.title}</span>
          </div>
        )}
      </div>

      {note.tags.length > 0 && (
        <div className="note-tags">
          <strong>Tags:</strong>
          {note.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="note-content">
        <div className="content-text">
          {note.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteView;