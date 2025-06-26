import React, { useState } from 'react';
import { Course } from '../../../../shared/src/index';
import { useCourses } from '../../hooks/useCourses';

interface CourseSelectorProps {
  selectedCourseId?: string;
  onCourseSelect: (courseId: string) => void;
  onAddNewCourse?: () => void;
  placeholder?: string;
  required?: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  selectedCourseId,
  onCourseSelect,
  onAddNewCourse,
  placeholder = "Select a course",
  required = false
}) => {
  const { courses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourse = courses.find(course => course.id === selectedCourseId);

  const handleCourseSelect = (courseId: string) => {
    onCourseSelect(courseId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="course-selector">
      <div 
        className="selector-display"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCourse ? (
          <div className="selected-course">
            <span 
              className="course-color" 
              style={{ backgroundColor: selectedCourse.color }}
            ></span>
            <span>{selectedCourse.name} ({selectedCourse.code})</span>
          </div>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="selector-dropdown">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="course-search"
          />
          
          <div className="course-options">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="course-option"
                onClick={() => handleCourseSelect(course.id)}
              >
                <span 
                  className="course-color" 
                  style={{ backgroundColor: course.color }}
                ></span>
                <span>{course.name}</span>
                <span className="course-code">({course.code})</span>
              </div>
            ))}
            
            {onAddNewCourse && (
              <div 
                className="course-option add-new"
                onClick={onAddNewCourse}
              >
                + Add New Course
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSelector;