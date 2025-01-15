import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../store/services/api';
import { ROUTES } from '../routes';

// Component that handles logging out the user and redirecting to login page
export const LogoutPage = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
      // Redirect to login page regardless of success/failure
      navigate(ROUTES.LOGIN);
    };

    performLogout();
  }, [logout, navigate]);

  return null; // This page doesn't render anything
};
