import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useUser, useUserLoading } from '../providers/UserContext';

/**
 * AuthRoute prevents authenticated users from accessing auth pages (login/signup).
 * If a user is already logged in (has a valid session), they will be redirected
 * to the home page or their original destination.
 */
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const user = useUser();
  const isLoading = useUserLoading();

  // Don't redirect while checking session
  if (isLoading) {
    return null;
  }

  // If we have a user session, redirect away from auth pages
  if (user?.id) {
    // Get the redirect path from location state, or default to home
    const from = location.state?.from?.pathname || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  // Show the auth page
  return <>{children}</>;
};
