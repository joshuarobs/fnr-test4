import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../routes';

/**
 * AuthRoute prevents authenticated users from accessing auth pages (login/signup).
 * If a user is already logged in (has a valid token), they will be redirected
 * to the home page or their original destination.
 */
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // If we have a token, assume user is logged in
  if (token) {
    // Get the redirect path from location state, or default to home
    const from = location.state?.from?.pathname || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  // Show the auth page
  return <>{children}</>;
};
