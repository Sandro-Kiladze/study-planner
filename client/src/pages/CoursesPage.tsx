import React, { useState } from 'react';
import { Course } from  '../../../shared/src/index';
import { useCourses } from '../hooks/useCourses';
import { useAssignments } from '../hooks/useAssignments';
import CourseList from '../components/courses/CourseList';
import CourseForm from '../components/courses/CourseForm';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal'

const CoursesPage: React.FC = () => {
  const { 
    courses, 
    createCourse, 
    updateCourse, 
    deleteCourse, 
    loading, 
    error 
  } = useCourses();
  
  const { assignments } = useAssignments();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);

  const handleAddCourse = () => {
    setEditingCourse(undefined);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleFormSubmit = async (courseData: any) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await createCourse(courseData);
      }
      setShowForm(false);
      setEditingCourse(undefined);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId);
    if (courseAssignments.length > 0) {
      alert('Cannot delete course with existing assignments');
      return;
    }
    setDeletingCourse(courseId);
  };

  const confirmDelete = async () => {
    if (deletingCourse) {
      try {
        await deleteCourse(deletingCourse);
        setDeletingCourse(null);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const getCourseStats = () => {
    return courses.map(course => {
      const courseAssignments = assignments.filter(a => a.courseId === course.id);
      const completedAssignments = courseAssignments.filter(a => a.status === 'completed');
      const overdueAssignments = courseAssignments.filter(a => 
        a.status !== 'completed' && new Date(a.dueDate) < new Date()
      );

      return {
        ...course,
        totalAssignments: courseAssignments.length,
        completedAssignments: completedAssignments.length,
        overdueAssignments: overdueAssignments.length,
        completionRate: courseAssignments.length > 0 
          ? Math.round((completedAssignments.length / courseAssignments.length) * 100)
          : 0
      };
    });
  };

  const courseStats = getCourseStats();

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>Courses</h1>
        <button onClick={handleAddCourse} className="btn-primary">
          Add New Course
        </button>
      </div>

      <div className="courses-overview">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p className="stat-number">{courses.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Assignments</h3>
            <p className="stat-number">
              {assignments.filter(a => a.status !== 'completed').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Overdue Items</h3>
            <p className="stat-number">
              {assignments.filter(a => 
                a.status !== 'completed' && new Date(a.dueDate) < new Date()
              ).length}
            </p>
          </div>
        </div>
      </div>

      <CourseList
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <CourseForm
            course={editingCourse}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={loading}
          />
        </Modal>
      )}

      {deletingCourse && (
        <ConfirmDialog
         isOpen={true}  
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeletingCourse(null)}
        />
      )}
    </div>
  );
};

export default CoursesPage;