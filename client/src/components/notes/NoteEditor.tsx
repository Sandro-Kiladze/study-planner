import React, { useState, useEffect } from 'react';
import { Note } from '../../../../shared/src/types/Note';
import { CreateNoteRequest } from '../../../../shared/src/types/api/CreateNoteRequest';
import { UpdateNoteRequest } from '../../../../shared/src/types/api/UpdateNoteRequest';
import { useCourses } from '../../hooks/useCourses';
import { useAssignments } from '../../hooks/useAssignments';

interface NoteEditorProps {
  note?: Note; // undefined for new notes
  onSave: (noteData: CreateNoteRequest | UpdateNoteRequest) => void;
  onCancel: () => void;
  preselectedCourse?: string;
  preselectedAssignment?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
  preselectedCourse,
  preselectedAssignment
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [courseId, setCourseId] = useState(note?.courseId || preselectedCourse || '');
  const [assignmentId, setAssignmentId] = useState(note?.assignmentId || preselectedAssignment || '');
  const [tags, setTags] = useState(note?.tags.join(', ') || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { courses } = useCourses();
  const { assignments } = useAssignments();

  // Track changes for auto-save indicator
  useEffect(() => {
    if (note) {
      const hasChanges = 
        title !== note.title ||
        content !== note.content ||
        courseId !== (note.courseId || '') ||
        assignmentId !== (note.assignmentId || '') ||
        tags !== note.tags.join(', ');
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(title.trim() !== '' || content.trim() !== '');
    }
  }, [title, content, courseId, assignmentId, tags, note]);

  const handleSave = () => {
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      courseId: courseId || undefined,
      assignmentId: assignmentId || undefined,
      tags: tagsArray
    };

    onSave(noteData);
  };

  const filteredAssignments = courseId 
    ? assignments.filter(assignment => assignment.courseId === courseId)
    : assignments;

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <h2>{note ? 'Edit Note' : 'Create New Note'}</h2>
        <div className="editor-status">
          {hasUnsavedChanges && <span className="unsaved-indicator">Unsaved changes</span>}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="course">Course (optional)</label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setAssignmentId(''); // Reset assignment when course changes
              }}
            >
              <option value="">No course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignment">Assignment (optional)</label>
            <select
              id="assignment"
              value={assignmentId}
              onChange={(e) => setAssignmentId(e.target.value)}
              disabled={!courseId}
            >
              <option value="">No assignment</option>
              {filteredAssignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>{assignment.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="study, review, important..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            rows={15}
            required
          />
          <div className="character-count">
            {content.length} characters
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={!title.trim() || !content.trim()}>
            {note ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteEditor;