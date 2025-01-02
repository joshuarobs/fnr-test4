import { useLocation } from 'react-router-dom';

// Custom hook to check if current route is under admin portal
export const useIsAdminRoute = () => {
  const location = useLocation();
  return location.pathname.startsWith('/admin/');
};
