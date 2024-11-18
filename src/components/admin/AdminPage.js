import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import SystemMonitoring from './pages/SystemMonitoring';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/usermanagement" element={<UserManagement />} />
        <Route path="/system" element={<SystemMonitoring />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;