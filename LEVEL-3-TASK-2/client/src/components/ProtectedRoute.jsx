import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {

  const { isLoggedin } = useContext(AppContent);

  // If the user is NOT logged in, redirect to login page
  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access to the route (Dashboard)
  return children;
};

export default ProtectedRoute;