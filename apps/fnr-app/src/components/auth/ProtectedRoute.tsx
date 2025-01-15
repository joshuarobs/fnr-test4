import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useUserLoading } from '../providers/UserContext';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoading = useUserLoading();

  // If there's no token, redirect to login
  if (!token) {
    // Save the attempted URL to redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Show loading state while fetching user data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If we get here, we have valid auth and user data is loaded
  return <>{children}</>;
};
