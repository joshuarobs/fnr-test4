import { Navigate, useLocation } from 'react-router-dom';
import { useGetStaffQuery } from '../../store/services/api';
import { ROUTES } from '../../routes';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  // If there's no token or employeeId, redirect to login
  if (!token || !employeeId) {
    // Save the attempted URL to redirect back after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If we have user data, render the protected content
  return <>{children}</>;
};
