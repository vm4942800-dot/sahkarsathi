import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Customer Route Guard
 * Enforces role-based access for customer dashboard and booking routes.
 */
export default function CustomerRouteGuard({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-brand-secondary">Verifying customer session...</p>
        </div>
      </div>
    );
  }

  // Allow access if logged in as customer or admin (for customer oversight)
  const isAllowed = user && (role === 'customer' || role === 'admin');

  if (!isAllowed) {
    return <Navigate to="/login?role=customer" state={{ from: location }} replace />;
  }

  return children;
}
