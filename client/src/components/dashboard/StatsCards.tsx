import React from 'react';
import { Course } from '../../../../shared/src/types/Course';
import { Assignment } from '../../../../shared/src/types/Assignment';
import { Note } from '../../../../shared/src/types/Note';
import { isAfter, isBefore, subDays } from 'date-fns';

interface StatsCardsProps {
  assignments: Assignment[];
  notes: Note[];
  courses: Course[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ assignments, notes, courses }) => {
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === 'completed').length;
  const overdueAssignments = assignments.filter(a => 
    a.status !== 'completed' && isBefore(a.dueDate, new Date())
  ).length;
  const completionRate = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  const totalNotes = notes.length;
  const recentNotes = notes.filter(n => 
    isAfter(n.createdAt, subDays(new Date(), 7))
  ).length;

  const totalCourses = courses.length;
  
  const upcomingDeadlines = assignments.filter(a => 
    a.status !== 'completed' && 
    isAfter(a.dueDate, new Date()) && 
    isBefore(a.dueDate, subDays(new Date(), -7))
  ).length;

  const stats = [
    {
      title: 'Total Assignments',
      value: totalAssignments,
      subtitle: `${completedAssignments} completed`,
      color: '#007bff',
      icon: '📝'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate}%`,
      subtitle: completionRate >= 80 ? 'Excellent!' : 'Keep going!',
      color: completionRate >= 80 ? '#28a745' : '#ffc107',
      icon: '🎯'
    },
    {
      title: 'Notes Created',
      value: totalNotes,
      subtitle: `${recentNotes} this week`,
      color: '#17a2b8',
      icon: '📓'
    },
    {
      title: 'Active Courses',
      value: totalCourses,
      subtitle: `${upcomingDeadlines} upcoming deadlines`,
      color: '#6f42c1',
      icon: '🎓'
    }
  ];

  if (overdueAssignments > 0) {
    stats.push({
      title: 'Overdue',
      value: overdueAssignments,
      subtitle: 'Need attention!',
      color: '#dc3545',
      icon: '⚠️'
    });
  }

  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
            <p className="stat-subtitle">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;