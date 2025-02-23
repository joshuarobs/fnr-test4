import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useUser, useUserLoading } from '../providers/UserContext';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const user = useUser();
  const isLoading = useUserLoading();

  // Show loading state while checking session
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no user data in context, session is invalid
  if (!user?.id) {
    // Save the attempted URL to redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If we get here, we have valid session and user data is loaded
  return <>{children}</>;
};
