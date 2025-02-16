import { createContext, useContext, ReactNode } from 'react';
import { useGetUserQuery } from '../../store/services/api';

// Type for the user data stored in context
interface UserContextData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarColour: string;
  role: string;
  staff?: {
    employeeId: string;
    department: string;
    position: string;
  };
  supplier?: {
    company: string;
  };
  insured?: {
    address: string;
  };
}

interface UserContextState {
  user: UserContextData | undefined;
  isLoading: boolean;
}

// Create context with undefined initial value
const UserContext = createContext<UserContextState | undefined>(undefined);

// Provider component that fetches and provides user data
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  const {
    data: userData,
    isLoading,
    isError,
  } = useGetUserQuery(token ?? '', {
    skip: !token,
  });

  const contextValue: UserContextState = {
    user: userData,
    isLoading: !isError && (isLoading || !userData) && !!token,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  // During loading or if no user data yet, return empty object
  if (!context.user) {
    return {} as UserContextData;
  }
  return context.user;
};

// Hook to access loading state
export const useUserLoading = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserLoading must be used within a UserProvider');
  }
  return context.isLoading;
};
