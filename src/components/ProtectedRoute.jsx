import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireProfileComplete = true }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile needs to be completed
  if (requireProfileComplete && user?.is_profile_completed === 0) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;