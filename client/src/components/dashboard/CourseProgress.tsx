import React from 'react';
import { Course } from '../../../../shared/src/types/Course';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { useNavigate } from 'react-router-dom';

interface CourseProgressProps {
  assignments: Assignment[];
  courses: Course[];
}

const CourseProgress: React.FC<CourseProgressProps> = ({ assignments, courses }) => {
  const navigate = useNavigate();
  
  const getCourseProgress = (courseId: string) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId);
    const completed = courseAssignments.filter(a => a.status === 'completed').length;
    const total = courseAssignments.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const coursesWithProgress = courses.map(course => ({
    ...course,
    progress: getCourseProgress(course.id)
  })).sort((a, b) => b.progress.total - a.progress.total);

  const handleViewAll = () => {
    navigate('/courses');
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>Course Progress</h3>
        <span className="widget-count">{courses.length}</span>
      </div>
      
      <div className="widget-content">
        {coursesWithProgress.length === 0 ? (
          <div className="empty-state">
            <p>No courses yet. Add your first course!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/courses?action=create')}
            >
              Add Course
            </button>
          </div>
        ) : (
          <ul className="course-list">
            {coursesWithProgress.map(course => (
              <li 
                key={course.id} 
                className="course-item clickable"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="course-info">
                  <div className="course-header">
                    <h4 className="course-name">{course.name}</h4>
                    <span className="course-code">{course.code}</span>
                  </div>
                  
                  <div className="progress-section">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${course.progress.percentage}%`,
                          backgroundColor: course.color || '#007bff'
                        }}
                      />
                    </div>
                    <div className="progress-text">
                      {course.progress.completed}/{course.progress.total} assignments completed
                      ({course.progress.percentage}%)
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="widget-footer">
        <button className="view-all-btn" onClick={handleViewAll}>
          View All Courses
        </button>
      </div>
    </div>
  );
};

export default CourseProgress;