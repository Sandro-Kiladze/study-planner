import React, { useState } from 'react';

export type SortByOption = 'createdAt' | 'updatedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface NotesFiltersState {
  search: string;
  courseId: string;
  tags: string[];
  sortBy: SortByOption;
  sortOrder: SortOrder;
}

export interface NotesFiltersProps {
  courses: Course[];
  onFilterChange: (filters: NotesFiltersState) => void;
  availableTags: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  color: string;
}

const NotesFilters: React.FC<NotesFiltersProps> = ({
  courses,
  onFilterChange,
  availableTags
}) => {
  const [search, setSearch] = useState('');
  const [courseId, setCourseId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOption>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleFilterChange = () => {
    onFilterChange({
      search,
      courseId,
      tags: selectedTags,
      sortBy,
      sortOrder
    });
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [search, courseId, selectedTags, sortBy, sortOrder]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="notes-filters">
      <div className="filter-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="course-filter"
        >
          <option value="">All Courses</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortByOption)}
            className="sort-select"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Created Date</option>
            <option value="title">Title</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="tags-filter">
          <span className="filter-label">Tags:</span>
          <div className="tags-list">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesFilters;