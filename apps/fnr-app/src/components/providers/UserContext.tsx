import { createContext, useContext, ReactNode } from 'react';
import { useGetStaffQuery } from '../../store/services/api';

// Type for the user data stored in context
interface UserContextData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarColour: string;
  department: string;
  position: string;
}

// Create context with undefined initial value
const UserContext = createContext<UserContextData | undefined>(undefined);

// Provider component that fetches and provides user data
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Using ADM001 as default user from seed data
  const { data: userData } = useGetStaffQuery('ADM001');

  // Only render children when we have user data
  if (!userData) return null;

  const contextValue: UserContextData = {
    employeeId: userData.staff.employeeId ?? '',
    firstName: userData.firstName ?? '',
    lastName: userData.lastName ?? '',
    email: userData.email ?? '',
    avatarColour: userData.avatarColour ?? '',
    department: userData.staff.department ?? '',
    position: userData.staff.position ?? '',
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
  return context;
};
