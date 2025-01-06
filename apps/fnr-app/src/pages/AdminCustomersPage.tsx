import React from 'react';
import { useGetCustomersQuery } from '../store/services/api';
import { CustomersTable } from '../components/admin/CustomersTable';

/**
 * AdminCustomersPage displays a list of all customers (insured users)
 * with their details and claim statistics
 */
export const AdminCustomersPage = () => {
  const { data: customers, isLoading, error } = useGetCustomersQuery();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-red-500">Error loading customers</p>
        </div>
      ) : (
        <CustomersTable customers={customers} />
      )}
    </div>
  );
};
