import React, { useState } from 'react';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { Course } from '../../../../shared/src/types/Course';
import { AssignmentItem } from './AssignmentItem';
import { format, isAfter } from 'date-fns';

interface AssignmentListProps {
  assignments: Assignment[];
  courses: Course[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Assignment['status']) => void;
}

type SortField = 'dueDate' | 'priority' | 'title' | 'status';
type SortDirection = 'asc' | 'desc';

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  courses,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const getCourseById = (courseId: string) => 
    courses.find(course => course.id === courseId);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'status':
        const statusOrder = { pending: 1, 'in-progress': 2, completed: 3 };
        aValue = statusOrder[a.status];
        bValue = statusOrder[b.status];
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="assignment-list">
      <div className="list-header">
        <button onClick={() => handleSort('title')}>
          Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => handleSort('dueDate')}>
          Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => handleSort('priority')}>
          Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => handleSort('status')}>
          Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
        </button>
      </div>
      
      <div className="assignments-container">
        {sortedAssignments.map(assignment => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            course={getCourseById(assignment.courseId)}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {assignments.length === 0 && (
          <div className="no-assignments">
            No assignments found. Create your first assignment!
          </div>
        )}
      </div>
    </div>
  );
};