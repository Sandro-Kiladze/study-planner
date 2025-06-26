import React from 'react';
import { Course } from '../../../../shared/src/index';
interface CourseItemProps {
  course: Course;
  assignmentCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

const CourseItem: React.FC<CourseItemProps> = ({ 
  course, 
  assignmentCount, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="course-card" style={{ borderLeft: `4px solid ${course.color}` }}>
      <div className="course-header">
        <h3 className="course-name">{course.name}</h3>
        <span className="course-code">{course.code}</span>
      </div>
      
      <div className="course-details">
        {course.instructor && (
          <p className="instructor">Instructor: {course.instructor}</p>
        )}
        <p className="semester">{course.semester} {course.year}</p>
        <p className="assignment-count">{assignmentCount} assignments</p>
      </div>

      <div className="course-actions">
        <button onClick={onEdit} className="btn-edit">Edit</button>
        <button 
          onClick={onDelete} 
          className="btn-delete"
          disabled={assignmentCount > 0}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CourseItem;