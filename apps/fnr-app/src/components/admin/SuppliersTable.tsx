import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';
import { NavAvatar } from '../contents-other/NavAvatar';

// Types for supplier data
interface Supplier {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  avatarColour?: string;
  supplier: {
    supplierId: string;
    company: string;
    allocatedClaims: number; // Count of claims assigned to this supplier
  };
}

interface SuppliersTableProps {
  suppliers: Supplier[];
}

// Table component for displaying supplier information
export const SuppliersTable = ({ suppliers }: SuppliersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Assigned Claims</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>
                <span className="font-mono text-sm">
                  {supplier.supplier.supplierId}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <NavAvatar
                  userInitials={`${supplier.firstName[0]}${supplier.lastName[0]}`}
                  name={`${supplier.firstName} ${supplier.lastName}`}
                  color={supplier.avatarColour}
                  userId={supplier.id.toString()}
                  disableNavigation
                  disableHover
                />
                <span>
                  {supplier.firstName} {supplier.lastName}
                </span>
              </TableCell>
              <TableCell>{supplier.supplier.company}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{supplier.email}</span>
                  {supplier.phone && (
                    <span className="text-sm text-muted-foreground">
                      {supplier.phone}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono">
                  {supplier.supplier.allocatedClaims}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {supplier.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
