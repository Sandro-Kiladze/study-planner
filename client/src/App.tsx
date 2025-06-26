import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

import './styles/assignments.css';
import './styles/notes.css';
import './styles/courses.css';


import { AssignmentsPage } from './pages/AssignmentsPage'; // Fixed path - should be pages/, not components/pages/
import NotesPage from './pages/NotesPage';
import CoursesPage from './pages/CoursesPage';



function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Dashboard - Coming Soon</div>} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/notes" element={<NotesPage />} />
               <Route path="/courses" element={<CoursesPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;