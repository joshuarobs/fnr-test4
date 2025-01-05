import React from 'react';
import { StaffUsersTable } from '../components/admin/StaffUsersTable';
import { useGetStaffUsersQuery } from '../store/services/api';

// Admin Users Page - Displays user management interface
export const AdminUsersPage = () => {
  const { data: staffUsers, isLoading } = useGetStaffUsersQuery();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        <StaffUsersTable users={staffUsers} />
      )}
    </div>
  );
};
