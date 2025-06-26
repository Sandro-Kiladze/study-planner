import React, { useState } from 'react';
import { Course } from '../../../shared/src/types/Course'; 
import CourseSelector from '../components/courses/CourseSelector';

const [selectedCourseId, setSelectedCourseId] = useState<string>('');

interface AssignmentFiltersProps {
  courses: Course[];
  filters: {
    courseId?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateRange?: { start: Date; end: Date };
  };
  onFiltersChange: (filters: any) => void;
}



export const AssignmentFilters: React.FC<AssignmentFiltersProps> = ({
  courses,
  filters,
  onFiltersChange,
}) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  // Quick filters for common actions
  const quickFilters = [
    { label: 'Due Today', filter: { dueToday: true } },
    { label: 'This Week', filter: { thisWeek: true } },
    { label: 'High Priority', filter: { priority: 'high' } },
    { label: 'Completed', filter: { status: 'completed' } },
  ];

  return (
    <div className="assignment-filters">
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search assignments..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        
        <select
          value={filters.courseId || ''}
          onChange={(e) => handleFilterChange('courseId', e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <select
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button onClick={() => onFiltersChange({})}>
          Clear Filters
        </button>
      </div>

      <div className="quick-filters">
        {quickFilters.map(qf => (
          <button
            key={qf.label}
            onClick={() => onFiltersChange({ ...filters, ...qf.filter })}
            className="quick-filter-btn"
          >
            {qf.label}
          </button>
        ))}
        <div className="filter-group">
  <label>Filter by Course:</label>
  <CourseSelector
    selectedCourseId={selectedCourseId}
    onCourseSelect={setSelectedCourseId}
    placeholder="All courses"
  />
  <button 
    onClick={() => setSelectedCourseId('')}
    className="btn-clear"
  >
    Clear
  </button>
</div>

      </div>
    </div>
  );
};
