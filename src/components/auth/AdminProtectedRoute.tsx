import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/loading-spinner';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (loading) return; // Wait for auth to finish loading
      
      setIsCheckingAdmin(true);
      
      if (!user) {
        setIsCheckingAdmin(false);
        return;
      }

      // Check if user is admin
      const isAdminUser = user.email === 'admin@campayn.local' || 
                         user.user_metadata?.is_admin === true ||
                         user.app_metadata?.is_admin === true;

      console.log('AdminProtectedRoute check:', {
        userEmail: user.email,
        isAdmin: isAdminUser,
        userMetadata: user.user_metadata,
        appMetadata: user.app_metadata
      });

      setIsAdmin(isAdminUser);
      setIsCheckingAdmin(false);
    };

    checkAdminAccess();
  }, [user, loading]);

  // Show loading while auth is loading or checking admin status
  if (loading || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4 text-gray-600">Checking admin access...</p>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to dashboard if not admin
  if (!isAdmin) {
    console.log('User is not admin, redirecting to brand dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if admin
  return <>{children}</>;
};

export default AdminProtectedRoute;