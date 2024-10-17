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
import { ItemStatusBadge } from './ItemStatusBadge';
import { BrowseLinkButton } from './BrowseLinkButton';

const ContentsTable = function () {
  const totalAmount = placeholderContentsData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead className="min-w-[320px]">Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Model/Serial Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {placeholderContentsData.map((item, index) => (
            <TableRow
              key={item.id}
              className={`${
                index % 2 === 0 ? 'bg-gray-100' : ''
              } min-h-[53px]!`}
            >
              <TableCell>{item.id}</TableCell>
              <TableCell className="min-w-[320px]">
                <div className="flex justify-between items-center mr-2">
                  <span>{item.item}</span>
                  <BrowseLinkButton tooltipText="Search for item in Google in a new tab" />
                </div>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <div className="flex justify-between items-center space-x-2 mr-2">
                  {item.modelSerialNumber ? (
                    <ModelSerialCell
                      modelSerialNumber={item.modelSerialNumber}
                    />
                  ) : (
                    <span>-</span>
                  )}
                  <BrowseLinkButton tooltipText="Search for model/serial number in Google in a new tab" />
                </div>
              </TableCell>
              <TableCell>
                <ItemStatusBadge status={item.status} />
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.dueDate}</TableCell>
              <TableCell className="text-right">
                ${item.amount.toFixed(2)}
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
