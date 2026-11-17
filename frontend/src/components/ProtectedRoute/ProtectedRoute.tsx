import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    // Decode the JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));

    // 1. Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" state={{ from: location, message: 'Session expired. Please log in again.' }} replace />;
    }

    // 2. Check for role
    const userRole = payload.role;
    const roleToCheck = requiredRole || 'admin'; // Default to admin for all protected routes

    if (userRole !== roleToCheck) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/login" state={{ from: location, message: 'Invalid session. Please log in again.' }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;