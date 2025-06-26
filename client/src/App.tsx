import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';
import './styles/assignments.css';
import { AssignmentsPage } from './pages/AssignmentsPage'; // Fixed path - should be pages/, not components/pages/

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Dashboard - Coming Soon</div>} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/notes" element={<div>Notes - Coming Soon</div>} />
          <Route path="/courses" element={<div>Courses - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;