import React from 'react';
import { Note } from '../../../../shared/src/types/Note';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface RecentNotesProps {
  notes: Note[];
}

const RecentNotes: React.FC<RecentNotesProps> = ({ notes }) => {
  const navigate = useNavigate();
  
  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const truncateContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  const handleViewAll = () => {
    navigate('/notes');
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>Recent Notes</h3>
        <span className="widget-count">{recentNotes.length}</span>
      </div>
      
      <div className="widget-content">
        {recentNotes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/notes?action=create')}
            >
              Create Note
            </button>
          </div>
        ) : (
          <ul className="notes-list">
            {recentNotes.map(note => (
              <li 
                key={note.id} 
                className="note-item clickable"
                onClick={() => handleNoteClick(note.id)}
              >
                <div className="note-info">
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-preview">
                    {truncateContent(note.content)}
                  </p>
                  <div className="note-meta">
                    <span className="note-date">
                      {format(new Date(note.updatedAt), 'MMM dd')}
                    </span>
                    {note.tags.length > 0 && (
                      <div className="note-tags">
                        {note.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="tag-more">+{note.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="widget-footer">
        <button className="view-all-btn" onClick={handleViewAll}>
          View All Notes
        </button>
      </div>
    </div>
  );
};

export default RecentNotes;