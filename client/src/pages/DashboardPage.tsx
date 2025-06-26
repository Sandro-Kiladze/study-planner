import React from 'react';
import { useAssignments } from '../hooks/useAssignments';
import { useNotes } from '../hooks/useNotes';
import { useCourses } from '../hooks/useCourses';
import { useDashboardData } from '../hooks/useDashboardData';
import UpcomingAssignments from '../components/dashboard/UpcomingAssignments';
import OverdueAssignments from '../components/dashboard/OverdueAssignments';
import RecentNotes from '../components/dashboard/RecentNotes';
import CourseProgress from '../components/dashboard/CourseProgress';
import StatsCards from '../components/dashboard/StatsCards';
import CalendarView from '../components/calendar/CalendarView';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { assignments, loading: assignmentsLoading, error: assignmentsError } = useAssignments();
  const { notes, loading: notesLoading, error: notesError } = useNotes();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();

  const isLoading = assignmentsLoading || notesLoading || coursesLoading;
  const hasError = assignmentsError || notesError || coursesError;

  const dashboardData = useDashboardData(assignments, notes, courses);

  if (isLoading) return <LoadingSpinner />;
  if (hasError) return <ErrorMessage error="Failed to load dashboard data" />;

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'assignment':
        navigate('/assignments?action=create');
        break;
      case 'note':
        navigate('/notes?action=create');
        break;
      case 'course':
        navigate('/courses?action=create');
        break;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your study overview</p>
      </div>
      
      <div className="dashboard-content">
        <StatsCards 
          assignments={assignments} 
          notes={notes} 
          courses={courses} 
        />

        <div className="dashboard-grid">
          <div className="dashboard-column-left">
            <UpcomingAssignments assignments={dashboardData.upcomingAssignments} />
            <RecentNotes notes={dashboardData.recentNotes} />
            <AnalyticsChart assignments={assignments} />
          </div>
          
          <div className="dashboard-column-right">
            <OverdueAssignments assignments={dashboardData.overdueAssignments} />
            <CourseProgress 
              assignments={assignments} 
              courses={courses} 
            />
          </div>
        </div>

        <section className="calendar-section">
          <h2>Assignment Calendar</h2>
          <CalendarView 
            assignments={assignments}
            onSelectAssignment={(assignment) => {
              navigate(`/assignments/${assignment.id}`);
            }}
          />
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => handleQuickAction('assignment')}
            >
              + Add Assignment
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleQuickAction('note')}
            >
              + Add Note
            </button>
            <button 
              className="btn btn-tertiary"
              onClick={() => handleQuickAction('course')}
            >
              + Add Course
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;