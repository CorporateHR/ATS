import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'recruiter' | 'manager')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, initialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  useEffect(() => {
    console.log('ProtectedRoute - Current user:', user);
    console.log('ProtectedRoute - Current location:', location);
    console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  }, [user, location.pathname, allowedRoles]);

  // Show nothing while initializing
  if (!initialized) {
    return null;
  }

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to login');
    // Not logged in, redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not authorized:', user.role);
    // Role not authorized, redirect to home page
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
