import { createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetUserQuery } from '../../store/services/api';
import { ROUTES } from '../../routes';

import { AppShellData } from '../../store/services/api';

interface UserContextState {
  user: AppShellData['user'] | undefined;
  isLoading: boolean;
  recentlyViewedClaims: AppShellData['recentlyViewedClaims'];
  assignedClaims: AppShellData['assignedClaims'];
}

// Create context with undefined initial value
const UserContext = createContext<UserContextState | undefined>(undefined);

// Provider component that fetches and provides user data
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGN_UP;

  const {
    data: userData,
    isLoading,
    isError,
  } = useGetUserQuery('me', {
    // Skip fetching on auth routes to prevent redirect loops
    skip: isAuthRoute,
  });

  // Consider loading complete only when we have all required data
  const isLoadingData = !isAuthRoute && (!userData?.user || isLoading);
  const hasError = !isAuthRoute && isError;

  const contextValue: UserContextState = {
    user: userData?.user,
    isLoading: isLoadingData,
    // Only return empty arrays when explicitly not loading and no error
    recentlyViewedClaims:
      isLoadingData || hasError ? [] : userData?.recentlyViewedClaims || [],
    assignedClaims:
      isLoadingData || hasError ? [] : userData?.assignedClaims || [],
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hooks to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  // Return empty object only if not loading and no user data
  if (!context.isLoading && !context.user) {
    return {} as AppShellData['user'];
  }
  return context.user || ({} as AppShellData['user']);
};

// Hook to access loading state
export const useUserLoading = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserLoading must be used within a UserProvider');
  }
  return context.isLoading;
};

// Hook to access recently viewed claims
export const useRecentlyViewedClaims = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      'useRecentlyViewedClaims must be used within a UserProvider'
    );
  }
  return {
    claims: context.recentlyViewedClaims,
    isLoading: context.isLoading,
  };
};

// Hook to access assigned claims
export const useAssignedClaims = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useAssignedClaims must be used within a UserProvider');
  }
  return {
    claims: context.assignedClaims,
    isLoading: context.isLoading,
  };
};
