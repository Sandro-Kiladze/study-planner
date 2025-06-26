import React, { useState, useEffect } from 'react';
import { Assignment} from '../../../../shared/src/types/Assignment';
import { Course} from '../../../../shared/src/types/Course';
// Update the interface in AssignmentForm.tsx
interface AssignmentFormData {
  title: string;
  description?: string;
  courseId: string;
  dueDate: Date;
  priority: Assignment['priority'];
  status: Assignment['status'];
}

interface AssignmentFormProps {
  assignment?: Assignment; // undefined for new assignment
  courses: Course[];
  onSubmit: (assignment: AssignmentFormData) => void; // Changed from Partial<Assignment>
  onCancel: () => void;
}
export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  assignment,
  courses,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    priority: 'medium' as Assignment['priority'],
    status: 'pending' as Assignment['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        courseId: assignment.courseId,
        dueDate: new Date(assignment.dueDate).toISOString().split('T')[0],
        priority: assignment.priority,
        status: assignment.status,
      });
    }
  }, [assignment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate),
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assignment-form">
      <h2>{assignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="courseId">Course *</label>
        <select
          id="courseId"
          value={formData.courseId}
          onChange={(e) => handleChange('courseId', e.target.value)}
          className={errors.courseId ? 'error' : ''}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
        {errors.courseId && <span className="error-message">{errors.courseId}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={errors.dueDate ? 'error' : ''}
          />
          {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {assignment ? 'Update Assignment' : 'Create Assignment'}
        </button>
      </div>
    </form>
  );
};