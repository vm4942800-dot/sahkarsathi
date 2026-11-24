import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Admin Route Guard
 * Enforces role-based access for central executive platform administration.
 * Tagline: Every Worker Matters. Every Home Counts.
 */
export default function AdminRouteGuard({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-emerald border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-brand-secondary">Verifying executive administrative authority...</p>
        </div>
      </div>
    );
  }

  // Strictly enforce role === 'admin'
  const isAllowed = user && role === 'admin';

  if (!isAllowed) {
    return <Navigate to="/login?role=admin" state={{ from: location }} replace />;
  }

  return children;
}
