import React from 'react';
import { Course } from '../../../../shared/src/index';
import { useAssignments } from '../../hooks/useAssignments';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface CourseDashboardProps {
  course: Course;
}

const CourseDashboard: React.FC<CourseDashboardProps> = ({ course }) => {
  const { assignments } = useAssignments();
  
  const courseAssignments = assignments.filter(a => a.courseId === course.id);
  const completedAssignments = courseAssignments.filter(a => a.status === 'completed');
  const upcomingAssignments = courseAssignments.filter(a => 
    a.status !== 'completed' && 
    isAfter(new Date(a.dueDate), new Date()) &&
    isBefore(new Date(a.dueDate), addDays(new Date(), 7))
  );
  const overdueAssignments = courseAssignments.filter(a => 
    a.status !== 'completed' && isBefore(new Date(a.dueDate), new Date())
  );

  return (
    <div className="course-dashboard">
      <div className="course-header" style={{ borderColor: course.color }}>
        <h2>{course.name}</h2>
        <span className="course-code">{course.code}</span>
      </div>

      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">Total Assignments</span>
          <span className="stat-value">{courseAssignments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedAssignments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Upcoming (7 days)</span>
          <span className="stat-value">{upcomingAssignments.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Overdue</span>
          <span className="stat-value overdue">{overdueAssignments.length}</span>
        </div>
      </div>

      {upcomingAssignments.length > 0 && (
        <div className="upcoming-assignments">
          <h3>Upcoming Assignments</h3>
          {upcomingAssignments.map(assignment => (
            <div key={assignment.id} className="assignment-item">
              <span className="assignment-title">{assignment.title}</span>
              <span className="assignment-due">
                Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDashboard;