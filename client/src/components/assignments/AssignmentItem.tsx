import React, { useState } from 'react';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { Course } from '../../../../shared/src/types/Course';
import { StatusBadge } from './StatusBadge';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import  RelatedNotes  from '../notes/RelatedNotes'; // Make sure to import RelatedNotes

interface AssignmentItemProps {
  assignment: Assignment;
  course?: Course;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Assignment['status']) => void;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  course,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isAfter(new Date(), dueDate) && assignment.status !== 'completed';
  
  const getDueDateDisplay = () => {
    if (isToday(dueDate)) return 'Due Today';
    if (isTomorrow(dueDate)) return 'Due Tomorrow';
    return `Due ${format(dueDate, 'MMM d, yyyy')}`;
  };

  const getPriorityClass = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = assignment.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(assignment.id, newStatus);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(assignment.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000); // Auto-hide after 3s
    }
  };

  const handleAddNote = () => {
    navigate(`/notes?assignment=${assignment.id}&course=${assignment.courseId}`);
  };

  return (
    <div className={`assignment-item ${isOverdue ? 'overdue' : ''} ${getPriorityClass(assignment.priority)}`}>
      <div className="assignment-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="assignment-main">
          <h3 className="assignment-title">{assignment.title}</h3>
          <div className="assignment-meta">
            {course && (
              <span className="course-name" style={{ color: course.color }}>
                {course.name}
              </span>
            )}
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              {getDueDateDisplay()}
            </span>
            <StatusBadge status={assignment.status} />
            <span className={`priority-badge ${getPriorityClass(assignment.priority)}`}>
              {assignment.priority.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="assignment-actions" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleStatusToggle}
            className={`status-toggle ${assignment.status === 'completed' ? 'completed' : ''}`}
            title={assignment.status === 'completed' ? 'Mark as incomplete' : 'Mark as complete'}
          >
            ✓
          </button>
          
          <button
            onClick={() => onEdit(assignment)}
            className="edit-btn"
            title="Edit assignment"
          >
            ✏️
          </button>
          
          <button
            onClick={handleDelete}
            className={`delete-btn ${showDeleteConfirm ? 'confirm' : ''}`}
            title={showDeleteConfirm ? 'Click again to confirm' : 'Delete assignment'}
          >
            {showDeleteConfirm ? '⚠️' : '🗑️'}
          </button>

          <button
            onClick={handleAddNote}
            className="add-note-btn"
            title="Add note"
          >
            + Add Note
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="assignment-details">
          {assignment.description && (
            <div className="assignment-description">
              <strong>Description:</strong>
              <p>{assignment.description}</p>
            </div>
          )}
          
          <div className="assignment-info">
            <div className="info-item">
              <strong>Created:</strong> {format(new Date(assignment.createdAt), 'MMM d, yyyy HH:mm')}
            </div>
            <div className="info-item">
              <strong>Last Updated:</strong> {format(new Date(assignment.updatedAt), 'MMM d, yyyy HH:mm')}
            </div>
          </div>

          <div className="assignment-notes-link">
            <button className="link-btn">
              View Related Notes →
            </button>
          </div>

          {/* Show related notes */}
          <RelatedNotes assignmentId={assignment.id} />
        </div>
      )}
    </div>
  );
};