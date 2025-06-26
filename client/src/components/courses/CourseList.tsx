import React from 'react';
import { Course } from '../../../../shared/src/index';
import { useCourses } from '../../hooks/useCourses';
import CourseItem from './CourseItem';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

interface CourseListProps {
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onEditCourse, onDeleteCourse }) => {
  const { courses, loading, error, getAssignmentCountByCourse } = useCourses();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="course-list">
      <div className="course-grid">
        {courses.map(course => (
          <CourseItem
            key={course.id}
            course={course}
            assignmentCount={getAssignmentCountByCourse(course.id)}
            onEdit={() => onEditCourse(course)}
            onDelete={() => onDeleteCourse(course.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;