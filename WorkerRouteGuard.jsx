import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Worker Route Guard
 * Enforces role-based access for worker terminal and field views.
 */
export default function WorkerRouteGuard({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-emerald border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-brand-secondary">Verifying worker credentials...</p>
        </div>
      </div>
    );
  }

  // Allow access if logged in as worker or supervisor
  const isAllowed = user && (role === 'worker' || role === 'supervisor');

  if (!isAllowed) {
    return <Navigate to="/login?role=worker" state={{ from: location }} replace />;
  }

  return children;
}
