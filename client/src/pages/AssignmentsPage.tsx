import React, { useState, useEffect } from 'react';
import { Assignment } from '../../../shared/src/types/Assignment';
import { AssignmentList } from '../components/assignments/AssignmentList';
import { AssignmentForm } from '../components/assignments/AssignmentForm';
import { AssignmentFilters } from '../components/assignments/AssignmentFilters';
import { useAssignments } from '../hooks/useAssignments';
import { useCourses } from '../hooks/useCourses';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// Define the form data type to match what the form actually provides
interface AssignmentFormData {
  title: string;
  description?: string;
  courseId: string;
  dueDate: Date;
  priority: Assignment['priority'];
  status: Assignment['status'];
}

export const AssignmentsPage: React.FC = () => {
  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = useAssignments();

  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
  } = useCourses();

  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();
  const [filters, setFilters] = useState({
    courseId: '',
    status: '',
    priority: '',
    search: '',
    dateRange: undefined,
  });

  const filteredAssignments = assignments.filter(assignment => {
    if (filters.courseId && assignment.courseId !== filters.courseId) return false;
    if (filters.status && assignment.status !== filters.status) return false;
    if (filters.priority && assignment.priority !== filters.priority) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!assignment.title.toLowerCase().includes(searchLower) &&
          !assignment.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    // Add date range filtering if needed
    return true;
  });

  const handleFormSubmit = async (assignmentData: AssignmentFormData) => {
    try {
      if (editingAssignment) {
        // For updates, we can use Partial<Assignment> since we're updating existing data
        await updateAssignment(editingAssignment.id, assignmentData);
      } else {
        // For creation, we need to ensure all required fields are present
        const createData = {
          title: assignmentData.title,
          description: assignmentData.description,
          courseId: assignmentData.courseId,
          dueDate: assignmentData.dueDate,
          priority: assignmentData.priority,
          status: assignmentData.status,
        };
        await createAssignment(createData);
      }
      setShowForm(false);
      setEditingAssignment(undefined);
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleStatusChange = async (id: string, status: Assignment['status']) => {
    try {
      await updateAssignment(id, { status });
    } catch (error) {
      console.error('Error updating assignment status:', error);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAssignment(undefined);
  };

  if (assignmentsLoading || coursesLoading) {
    return <LoadingSpinner />;
  }




  return (
    <div className="assignments-page">
      <div className="page-header">
        <h1>Assignments</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add Assignment
        </button>
      </div>

      <AssignmentFilters
        courses={courses}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="assignments-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-number">{filteredAssignments.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {filteredAssignments.filter(a => a.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {filteredAssignments.filter(a => a.status === 'completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <AssignmentList
        assignments={filteredAssignments}
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <AssignmentForm
              assignment={editingAssignment}
              courses={courses}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};