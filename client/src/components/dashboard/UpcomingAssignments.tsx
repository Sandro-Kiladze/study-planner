import React from 'react';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { format, isAfter, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({ assignments }) => {
  const navigate = useNavigate();
  
  const upcomingAssignments = assignments
    .filter(assignment => 
      assignment.status !== 'completed' &&
      isAfter(assignment.dueDate, new Date()) &&
      isAfter(addDays(new Date(), 7), assignment.dueDate)
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const handleViewAll = () => {
    navigate('/assignments');
  };

  const handleAssignmentClick = (assignmentId: string) => {
    navigate(`/assignments/${assignmentId}`);
  };

  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        <h3>Upcoming Assignments</h3>
        <span className="widget-count">{upcomingAssignments.length}</span>
      </div>
      
      <div className="widget-content">
        {upcomingAssignments.length === 0 ? (
          <p className="empty-state">No upcoming assignments in the next 7 days</p>
        ) : (
          <ul className="assignment-list">
            {upcomingAssignments.map(assignment => (
              <li 
                key={assignment.id} 
                className="assignment-item clickable"
                onClick={() => handleAssignmentClick(assignment.id)}
              >
                <div className="assignment-info">
                  <h4 className="assignment-title">{assignment.title}</h4>
                  <p className="assignment-course">{assignment.courseId}</p>
                  <p className="assignment-due">
                    Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div 
                  className="priority-indicator"
                  style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="widget-footer">
        <button className="view-all-btn" onClick={handleViewAll}>
          View All Assignments
        </button>
      </div>
    </div>
  );
};

export default UpcomingAssignments;