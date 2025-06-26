import React from 'react';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { format, isBefore } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface OverdueAssignmentsProps {
  assignments: Assignment[];
}

const OverdueAssignments: React.FC<OverdueAssignmentsProps> = ({ assignments }) => {
  const navigate = useNavigate();
  
  const overdueAssignments = assignments
    .filter(assignment => 
      assignment.status !== 'completed' &&
      isBefore(assignment.dueDate, new Date())
    )
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 5);

  const getDaysOverdue = (dueDate: Date) => {
    const days = Math.floor((new Date().getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleTakeAction = () => {
    // Navigate to assignments page with filter for overdue
    navigate('/assignments?filter=overdue');
  };

  const handleAssignmentClick = (assignmentId: string) => {
    navigate(`/assignments/${assignmentId}`);
  };

  return (
    <div className="dashboard-widget overdue-widget">
      <div className="widget-header">
        <h3>Overdue Assignments</h3>
        <span className="widget-count overdue-count">{overdueAssignments.length}</span>
      </div>
      
      <div className="widget-content">
        {overdueAssignments.length === 0 ? (
          <p className="empty-state success">Great! No overdue assignments</p>
        ) : (
          <ul className="assignment-list">
            {overdueAssignments.map(assignment => (
              <li 
                key={assignment.id} 
                className="assignment-item overdue-item clickable"
                onClick={() => handleAssignmentClick(assignment.id)}
              >
                <div className="assignment-info">
                  <h4 className="assignment-title">{assignment.title}</h4>
                  <p className="assignment-course">{assignment.courseId}</p>
                  <p className="assignment-overdue">
                    {getDaysOverdue(assignment.dueDate)} days overdue
                  </p>
                </div>
                <div className="overdue-indicator">
                  ⚠️
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {overdueAssignments.length > 0 && (
        <div className="widget-footer">
          <button className="urgent-btn" onClick={handleTakeAction}>
            Take Action
          </button>
        </div>
      )}
    </div>
  );
};

export default OverdueAssignments;