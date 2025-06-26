import React from 'react';
import { useCourses } from '../../hooks/useCourses';

interface NotesFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  courseFilter: string;
  onCourseFilterChange: (courseId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  sortOrder: string;
  onSortOrderChange: (order: string) => void;
}

const NotesFilters: React.FC<NotesFiltersProps> = ({
  searchTerm,
  onSearchChange,
  courseFilter,
  onCourseFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange
}) => {
  const { courses } = useCourses();

  return (
    <div className="notes-filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-controls">
        <select value={courseFilter} onChange={(e) => onCourseFilterChange(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
        
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="course">Sort by Course</option>
        </select>
        
        <button onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};

export default NotesFilters;