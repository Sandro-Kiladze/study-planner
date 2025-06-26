import React from 'react';
import { Assignment } from '../../../../shared/src/types/Assignment';

interface StatusBadgeProps {
  status: Assignment['status'];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusClass = (status: Assignment['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getStatusText = (status: Assignment['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)} ${className}`}>
      {getStatusText(status)}
    </span>
  );
};