import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SchoolManagement from './components/SchoolManagement';
import MoralEducation from './components/MoralEducation';
import TeachingManagement from './components/TeachingManagement';
import DataCollection from './components/DataCollection';
import SystemManagement from './components/SystemManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/school" element={<SchoolManagement />} />
          <Route path="/moral" element={<MoralEducation />} />
          <Route path="/teaching" element={<TeachingManagement />} />
          <Route path="/collection" element={<DataCollection />} />
          <Route path="/system" element={<SystemManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;