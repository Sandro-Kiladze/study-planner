import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, Course, Assignment, CreateNoteRequest, UpdateNoteRequest }
 from '../../../../study-planner/shared/src/index';
import './NoteEditor.css';

interface NoteEditorProps {
  note?: Note;
  courses: Course[];
  assignments: Assignment[];
  onSave: (noteData: CreateNoteRequest | UpdateNoteRequest) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

interface AutoSaveStatus {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  courses,
  assignments,
  onSave,
  onCancel,
  onDelete,
  isLoading = false
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [courseId, setCourseId] = useState(note?.courseId || '');
  const [assignmentId, setAssignmentId] = useState(note?.assignmentId || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>({ status: 'idle' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialValuesRef = useRef({ title, content, courseId, assignmentId, tags });

  const isEditing = !!note;

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      title !== initialValuesRef.current.title ||
      content !== initialValuesRef.current.content ||
      courseId !== initialValuesRef.current.courseId ||
      assignmentId !== initialValuesRef.current.assignmentId ||
      JSON.stringify(tags) !== JSON.stringify(initialValuesRef.current.tags);
    
    setHasUnsavedChanges(hasChanges);
  }, [title, content, courseId, assignmentId, tags]);

  // Auto-save functionality
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !title.trim()) return;

    setAutoSaveStatus({ status: 'saving' });
    
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        courseId: courseId || undefined,
        assignmentId: assignmentId || undefined,
        tags
      };

      await onSave(noteData);
      
      setAutoSaveStatus({ 
        status: 'saved', 
        lastSaved: new Date() 
      });
      setHasUnsavedChanges(false);
      
      // Update initial values
      initialValuesRef.current = { title, content, courseId, assignmentId, tags };
      
    } catch (error) {
      setAutoSaveStatus({ status: 'error' });
    }
  }, [title, content, courseId, assignmentId, tags, hasUnsavedChanges, onSave]);

  // Set up auto-save timer
  useEffect(() => {
    if (hasUnsavedChanges && title.trim()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, title, performAutoSave]);

  // Filter assignments by selected course
  const filteredAssignments = assignments.filter(assignment => 
    !courseId || assignment.courseId === courseId
  );

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      courseId: courseId || undefined,
      assignmentId: assignmentId || undefined,
      tags
    };

    await onSave(noteData);
  };

  const handleDelete = async () => {
    if (!note || !onDelete) return;
    
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this note? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      await onDelete(note.id);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const getCharacterCount = () => {
    return {
      title: title.length,
      content: content.length,
      total: title.length + content.length
    };
  };

  const renderAutoSaveStatus = () => {
    switch (autoSaveStatus.status) {
      case 'saving':
        return <span className="save-status saving">Saving...</span>;
      case 'saved':
        return (
          <span className="save-status saved">
            Saved {autoSaveStatus.lastSaved?.toLocaleTimeString()}
          </span>
        );
      case 'error':
        return <span className="save-status error">Save failed</span>;
      default:
        return hasUnsavedChanges ? (
          <span className="save-status unsaved">Unsaved changes</span>
        ) : null;
    }
  };

  const charCount = getCharacterCount();

  return (
    <div className={`note-editor ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="editor-header">
        <div className="header-left">
          <h2>{isEditing ? 'Edit Note' : 'New Note'}</h2>
          {renderAutoSaveStatus()}
        </div>
        
        <div className="header-right">
          <button
            onClick={toggleFullscreen}
            className="fullscreen-btn"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '⤓' : '⤢'}
          </button>
          
          {isEditing && onDelete && (
            <button
              onClick={handleDelete}
              className="delete-btn"
              disabled={isLoading}
              title="Delete Note"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-form">
          <div className="form-row">
            <div className="form-group title-group">
              <label htmlFor="note-title">Title *</label>
              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="title-input"
                maxLength={200}
                disabled={isLoading}
              />
              <span className="char-count">{charCount.title}/200</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="note-course">Course</label>
              <select
                id="note-course"
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  // Clear assignment if course changes
                  if (assignmentId && e.target.value !== courseId) {
                    setAssignmentId('');
                  }
                }}
                className="course-select"
                disabled={isLoading}
              >
                <option value="">No Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="note-assignment">Assignment</label>
              <select
                id="note-assignment"
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
                className="assignment-select"
                disabled={isLoading || !courseId}
              >
                <option value="">No Assignment</option>
                {filteredAssignments.map(assignment => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note-tags">Tags</label>
            <div className="tags-input-container">
              <div className="tags-display">
                {tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      onClick={() => removeTag(index)}
                      className="tag-remove"
                      type="button"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={addTag}
                  placeholder={tags.length === 0 ? "Add tags (press Enter to add)..." : ""}
                  className="tag-input"
                  disabled={isLoading}
                />
              </div>
            </div>
            <small className="help-text">
              Press Enter or comma to add tags. Use Backspace to remove.
            </small>
          </div>

          <div className="form-group content-group">
            <label htmlFor="note-content">Content</label>
            <textarea
              ref={contentTextareaRef}
              id="note-content"
              value={content}
              onChange={handleContentChange}
              placeholder="Write your note content here..."
              className="content-textarea"
              disabled={isLoading}
              rows={10}
            />
            <div className="content-footer">
              <span className="char-count">{charCount.content.toLocaleString()} characters</span>
              <small className="help-text">
                Supports plain text with line breaks
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <div className="footer-left">
          {isEditing && note && (
            <small className="note-dates">
              Created: {new Date(note.createdAt).toLocaleString()} • 
              Modified: {new Date(note.updatedAt).toLocaleString()}
            </small>
          )}
        </div>
        
        <div className="footer-right">
          <button
            onClick={onCancel}
            className="cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="save-btn"
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;