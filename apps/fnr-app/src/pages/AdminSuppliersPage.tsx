import React from 'react';
import { useGetSuppliersQuery } from '../store/services/api';
import { SuppliersTable } from '../components/admin/SuppliersTable';

// Admin Suppliers Page - Displays supplier management interface
export const AdminSuppliersPage = () => {
  // Fetch suppliers data
  const { data: suppliers = [], isLoading } = useGetSuppliersQuery();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Loading suppliers...</p>
        </div>
      ) : (
        <SuppliersTable suppliers={suppliers} />
      )}
    </div>
  );
};
