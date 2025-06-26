import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: ROUTES.HOME, label: 'Dashboard' },
    { path: ROUTES.ASSIGNMENTS, label: 'Assignments' },
    { path: ROUTES.NOTES, label: 'Notes' },
    { path: ROUTES.COURSES, label: 'Courses' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Study Planner</h1>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;