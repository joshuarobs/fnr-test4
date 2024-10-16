import React from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@react-monorepo/shared';

import { placeholderContentsData } from './placeholderContentsData';

const ContentsTable = function () {
  const totalAmount = placeholderContentsData.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  const modelSerialNumberStyle = {
    fontFamily: 'Consolas, monospace',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    padding: '8px 6px',
    fontSize: '0.9em',
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Model/Serial Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholderContentsData.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.item}</TableCell>
              <TableCell>{invoice.category}</TableCell>
              <TableCell>
                {invoice.modelSerialNumber ? (
                  <span style={modelSerialNumberStyle}>
                    {invoice.modelSerialNumber}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.dueDate}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell className="text-right">
                ${invoice.amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell className="text-right">
              ${totalAmount.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export { ContentsTable };
