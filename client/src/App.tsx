import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Dashboard - Coming Soon</div>} />
          <Route path="/assignments" element={<div>Assignments - Coming Soon</div>} />
          <Route path="/notes" element={<div>Notes - Coming Soon</div>} />
          <Route path="/courses" element={<div>Courses - Coming Soon</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;