import React from 'react';
import { Course} from '../../../../shared/src/types/Course';

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
    </div>
  );
};