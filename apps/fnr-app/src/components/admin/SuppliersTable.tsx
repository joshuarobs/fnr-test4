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
    company: string;
    serviceType: string[];
    areas: string[];
    ratings?: number;
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
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Service Types</TableHead>
            <TableHead>Areas</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="flex items-center gap-2">
                <NavAvatar
                  userInitials={`${supplier.firstName[0]}${supplier.lastName[0]}`}
                  name={`${supplier.firstName} ${supplier.lastName}`}
                  color={supplier.avatarColour}
                  disableNavigation
                />
                <span>
                  {supplier.firstName} {supplier.lastName}
                </span>
              </TableCell>
              <TableCell>{supplier.supplier.company}</TableCell>
              <TableCell>
                {supplier.supplier.serviceType.map((type, index) => (
                  <span
                    key={type}
                    className="inline-block bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs mr-1 mb-1"
                  >
                    {type}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                {supplier.supplier.areas.map((area, index) => (
                  <span
                    key={area}
                    className="inline-block bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs mr-1 mb-1"
                  >
                    {area}
                  </span>
                ))}
              </TableCell>
              <TableCell>
                {supplier.supplier.ratings ? (
                  <span className="flex items-center">
                    {supplier.supplier.ratings}
                    <svg
                      className="w-4 h-4 text-yellow-400 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                ) : (
                  'N/A'
                )}
              </TableCell>
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
