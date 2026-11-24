import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Supervisor Route Guard
 * Enforces role-based access for supervisor management and engineering views.
 */
export default function SupervisorRouteGuard({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-brand-secondary">Verifying supervisory authority...</p>
        </div>
      </div>
    );
  }

  // Only allow access if user has supervisor role
  const isAllowed = user && role === 'supervisor';

  if (!isAllowed) {
    return <Navigate to="/login?role=supervisor" state={{ from: location }} replace />;
  }

  return children;
}
