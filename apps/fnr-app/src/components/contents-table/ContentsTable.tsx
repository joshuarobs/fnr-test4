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
import { ModelSerialCell } from './ModelSerialCell';

const ContentsTable = function () {
  const totalAmount = placeholderContentsData.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

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
                  <ModelSerialCell
                    modelSerialNumber={invoice.modelSerialNumber}
                  />
                ) : (
                  <></>
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
