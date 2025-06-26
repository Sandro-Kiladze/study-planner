import React, { useState, useEffect } from 'react';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../../../../shared/src/index';

interface CourseFormProps {
  course?: Course;
  onSubmit: (courseData: CreateCourseRequest | UpdateCourseRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  course, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
    color: '#3B82F6',
    semester: 'Fall',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        code: course.code,
        instructor: course.instructor || '',
        color: course.color,
        semester: course.semester,
        year: course.year
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="course-form">
      <h2>{course ? 'Edit Course' : 'Add New Course'}</h2>
      
      <div className="form-group">
        <label htmlFor="name">Course Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="code">Course Code *</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="instructor">Instructor</label>
        <input
          type="text"
          id="instructor"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="semester">Semester</label>
          <select
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          >
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2020"
            max="2030"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="color">Course Color</label>
        <input
          type="color"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? 'Saving...' : (course ? 'Update Course' : 'Add Course')}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;