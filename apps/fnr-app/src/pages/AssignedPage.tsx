import React from 'react';
import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { useUser } from '../components/providers/UserContext';
import { useGetAssignedClaimsQuery } from '../store/services/api';

/**
 * AssignedPage displays claims that are assigned to the current logged-in user
 */
export const AssignedPage = () => {
  const user = useUser();
  const {
    data: claims,
    isLoading,
    error,
  } = useGetAssignedClaimsQuery({ employeeId: user.employeeId });

  if (isLoading) {
    return <div className="p-4">Loading assigned claims...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Assigned Claims</h1>
      <DetailedClaimsTable claims={claims} />
    </div>
  );
};
