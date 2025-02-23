import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../store/services/api';
import { ROUTES } from '../routes';
import { toast } from '@react-monorepo/shared';

// Component that handles logging out the user and redirecting to login page
export const LogoutPage = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Session will be cleared by the server
        navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error('Logout failed:', error);
        toast({
          title: 'Logout failed',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return null; // This page doesn't render anything
};
