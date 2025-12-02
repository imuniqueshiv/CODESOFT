import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Layout / UI Components
import Navbar from './components/Navbar';
import Header from './components/Header';

// Auth Pages
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';

// Project Management Tool Pages
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/ProjectPage';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />

      <Routes>

        {/* Public Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
  );
};

export default App;
