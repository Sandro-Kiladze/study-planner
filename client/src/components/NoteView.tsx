import React, { useState } from 'react';
import { Note, Course, Assignment } from '../../../../study-planner/shared/src/index';
import { formatDistanceToNow, format } from 'date-fns';
import { Edit, Trash2, Share2, Download, Maximize2, Minimize2, X, Link2, FileText } from 'lucide-react';
import './NoteView.css';

interface NoteViewProps {
  note: Note;
  course?: Course;
  assignment?: Assignment;
  onEdit: () => void;
  onDelete: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const NoteView: React.FC<NoteViewProps> = ({
  note,
  course,
  assignment,
  onEdit,
  onDelete,
  onClose,
  isLoading = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleShare = async (type: 'link' | 'text' | 'markdown') => {
    try {
      switch (type) {
        case 'link':
          navigator.clipboard.writeText(window.location.href);
          alert('Note link copied to clipboard!');
          break;
        case 'text':
          exportAsText();
          break;
        case 'markdown':
          exportAsMarkdown();
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share note');
    }
    setShowShareMenu(false);
  };

  const exportAsText = () => {
    const content = formatNoteForExport('text');
    downloadFile(content, `${note.title}.txt`, 'text/plain');
  };

  const exportAsMarkdown = () => {
    const content = formatNoteForExport('markdown');
    downloadFile(content, `${note.title}.md`, 'text/markdown');
  };

  const formatNoteForExport = (formatType: 'text' | 'markdown') => {
    const isMarkdown = formatType === 'markdown';
    const newline = '\n';
    const separator = isMarkdown ? '\n---\n' : '\n' + '='.repeat(50) + '\n';
    
    let content = '';
    
    // Title
    content += isMarkdown ? `# ${note.title}${newline}${newline}` : `${note.title}${newline}${newline}`;
  
    // Metadata
    if (course || assignment || note.tags.length > 0) {
      content += isMarkdown ? '## Metadata' + newline : 'METADATA:' + newline;
      
      if (course) {
        content += isMarkdown ? `**Course:** ${course.code} - ${course.name}${newline}` : `Course: ${course.code} - ${course.name}${newline}`;
      }
      
      if (assignment) {
        content += isMarkdown ? `**Assignment:** ${assignment.title}${newline}` : `Assignment: ${assignment.title}${newline}`;
      }
      
      if (note.tags.length > 0) {
        const tagsStr = note.tags.join(', ');
        content += isMarkdown ? `**Tags:** ${tagsStr}${newline}` : `Tags: ${tagsStr}${newline}`;
      }
      
      content += newline;
    }
    
    // Dates
    content += isMarkdown ? '## Dates' + newline : 'DATES:' + newline;
    content += isMarkdown 
      ? `**Created:** ${format(new Date(note.createdAt), 'PPpp')}${newline}` 
      : `Created: ${format(new Date(note.createdAt), 'PPpp')}${newline}`;
    content += isMarkdown 
      ? `**Modified:** ${format(new Date(note.updatedAt), 'PPpp')}${newline}${newline}` 
      : `Modified: ${format(new Date(note.updatedAt), 'PPpp')}${newline}${newline}`;
    
    // Content
    content += separator;
    content += isMarkdown ? '## Content' + newline + newline : 'CONTENT:' + newline + newline;
    content += note.content;
    
    return content;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h3 key={index} className="note-heading">{line.substring(2)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h4 key={index} className="note-subheading">{line.substring(3)}</h4>;
      }
      
      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const italicText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      return (
        <p 
          key={index} 
          className="note-paragraph"
          dangerouslySetInnerHTML={{ __html: italicText }}
        />
      );
    });
  };

  const getCharacterStats = () => {
    const words = note.content.trim().split(/\s+/).filter(word => word.length > 0);
    const lines = note.content.split('\n').length;
    const chars = note.content.length;
    
    return { words: words.length, lines, chars };
  };

  const stats = getCharacterStats();

  return (
    <div className={`note-view ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="note-header">
        <div className="header-left">
          <h1 className="note-title">{note.title}</h1>
          <div className="note-meta">
            {course && (
              <span 
                className="course-badge"
                style={{ backgroundColor: course.color }}
              >
                {course.code}
              </span>
            )}
            {assignment && (
              <span className="assignment-link">
                <FileText className="icon-sm" /> {assignment.title}
              </span>
            )}
            <span className="note-date">
              Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="share-menu-container">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="icon-btn"
              title="Share & Export"
              disabled={isLoading}
            >
              <Share2 className="icon" />
            </button>
            
            {showShareMenu && (
              <div className="share-menu">
                <button onClick={() => handleShare('link')}>
                  <Link2 className="icon-sm" /> Copy Link
                </button>
                <button onClick={() => handleShare('text')}>
                  <FileText className="icon-sm" /> Export as Text
                </button>
                <button onClick={() => handleShare('markdown')}>
                  <Download className="icon-sm" /> Export as Markdown
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="icon-btn"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            disabled={isLoading}
          >
            {isFullscreen ? <Minimize2 className="icon" /> : <Maximize2 className="icon" />}
          </button>
          
          <button
            onClick={onEdit}
            className="icon-btn"
            disabled={isLoading}
            title="Edit Note"
          >
            <Edit className="icon" />
          </button>
          
          <button
            onClick={handleDelete}
            className="icon-btn delete"
            disabled={isLoading}
            title="Delete Note"
          >
            <Trash2 className="icon" />
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="icon-btn"
              title="Close"
              disabled={isLoading}
            >
              <X className="icon" />
            </button>
          )}
        </div>
      </div>

      <div className="note-content">
        {formatContent(note.content)}
        
        {note.content.trim() === '' && (
          <div className="empty-content">
            <p>This note is empty.</p>
            <button onClick={onEdit} className="edit-empty-btn">
              Add Content
            </button>
          </div>
        )}
      </div>

      {note.tags.length > 0 && (
        <div className="note-tags">
          <h3>Tags</h3>
          <div className="tags-list">
            {note.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="note-details">
        <div className="details-section">
          <h3>Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">
                {format(new Date(note.createdAt), 'PPpp')}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Modified:</span>
              <span className="detail-value">
                {format(new Date(note.updatedAt), 'PPpp')}
              </span>
            </div>
            
            {course && (
              <div className="detail-item">
                <span className="detail-label">Course:</span>
                <span className="detail-value">
                  {course.code} - {course.name}
                  {course.instructor && ` (${course.instructor})`}
                </span>
              </div>
            )}
            
            {assignment && (
              <div className="detail-item">
                <span className="detail-label">Assignment:</span>
                <span className="detail-value">
                  {assignment.title}
                  <span className="assignment-due">
                    Due: {format(new Date(assignment.dueDate), 'PPp')}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="stats-section">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.chars.toLocaleString()}</span>
              <span className="stat-label">Characters</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{stats.words.toLocaleString()}</span>
              <span className="stat-label">Words</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-value">{stats.lines.toLocaleString()}</span>
              <span className="stat-label">Lines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Note</h3>
            <p>
              Are you sure you want to delete "{note.title}"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn secondary"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn danger"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteView;