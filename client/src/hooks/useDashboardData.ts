import { useMemo } from 'react';
import { Note } from '../../../shared/src/types/Note';
import { Course } from '../../../shared/src/types/Course';
import { Assignment } from '../../../shared/src/types/Assignment';
import { isAfter, isBefore, subDays, addDays } from 'date-fns';

interface DashboardData {
  upcomingAssignments: Assignment[];
  overdueAssignments: Assignment[];
  recentNotes: Note[];
  courseProgress: Array<{
    course: Course;
    completed: number;
    total: number;
    percentage: number;
  }>;
  stats: {
    totalAssignments: number;
    completedAssignments: number;
    completionRate: number;
    totalNotes: number;
    recentNotes: number;
    totalCourses: number;
    overdueCount: number;
    upcomingCount: number;
  };
}

export const useDashboardData = (
  assignments: Assignment[],
  notes: Note[],
  courses: Course[]
): DashboardData => {
  return useMemo(() => {
    const now = new Date();
    const weekFromNow = addDays(now, 7);
    const weekAgo = subDays(now, 7);

    // Upcoming assignments (next 7 days)
    const upcomingAssignments = assignments
      .filter(assignment => 
        assignment.status !== 'completed' &&
        isAfter(assignment.dueDate, now) &&
        isBefore(assignment.dueDate, weekFromNow)
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Overdue assignments
    const overdueAssignments = assignments
      .filter(assignment => 
        assignment.status !== 'completed' &&
        isBefore(assignment.dueDate, now)
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    // Recent notes (last 7 days)
    const recentNotes = notes
      .filter(note => isAfter(note.createdAt, weekAgo))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Course progress
    const courseProgress = courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.id);
      const completed = courseAssignments.filter(a => a.status === 'completed').length;
      const total = courseAssignments.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        course,
        completed,
        total,
        percentage
      };
    });

    // Statistics
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : 0;
    const totalNotes = notes.length;
    const recentNotesCount = recentNotes.length;
    const totalCourses = courses.length;
    const overdueCount = overdueAssignments.length;
    const upcomingCount = upcomingAssignments.length;

    return {
      upcomingAssignments,
      overdueAssignments,
      recentNotes,
      courseProgress,
      stats: {
        totalAssignments,
        completedAssignments,
        completionRate,
        totalNotes,
        recentNotes: recentNotesCount,
        totalCourses,
        overdueCount,
        upcomingCount
      }
    };
  }, [assignments, notes, courses]);
};