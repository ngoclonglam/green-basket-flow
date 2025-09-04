import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

interface AdminGuardProps {
  children: ReactNode;
  requiredRole?: 'owner' | 'admin' | 'staff';
}

export const AdminGuard = ({ children, requiredRole }: AdminGuardProps) => {
  const { user, profile, loading, isAdmin, hasRole } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to unauthorized if not admin
  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};