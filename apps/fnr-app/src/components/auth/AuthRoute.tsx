import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

/**
 * AuthRoute and ProtectedRoute serve complementary but distinct purposes in handling authentication flow:
 *
 * AuthRoute (this component):
 * - Used for authentication pages (login/signup)
 * - Prevents authenticated users from accessing auth pages
 * - Redirects to home or original destination if user is already logged in
 * - Example: Wrapping LoginPage to prevent logged-in users from seeing the login form
 *
 * ProtectedRoute (separate component):
 * - Used for protected content pages
 * - Prevents unauthenticated users from accessing protected pages
 * - Redirects to login if user is not logged in
 * - Example: Wrapping HomePage to ensure only authenticated users can access it
 */
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const employeeId = localStorage.getItem('employeeId');

  // If we have both token and employeeId, assume user is logged in
  if (token && employeeId) {
    // Get the redirect path from location state, or default to home
    const from = location.state?.from?.pathname || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  // Clear any partial auth data (e.g. if we have token but no employeeId or vice versa)
  if (token || employeeId) {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
  }

  // Show the auth page
  return <>{children}</>;
};
