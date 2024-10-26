import React from 'react';
import { Input } from '@react-monorepo/shared';
import { Table } from '@tanstack/react-table';
import { DataColumnToggleButton } from './DataColumnToggleButton';
import { FreezeColumnToggleButton } from './FreezeColumnToggleButton';
import { Item } from '../item';

interface ContentsTableToolbarProps {
  table: Table<Item>;
}

export const ContentsTableToolbar = ({ table }: ContentsTableToolbarProps) => {
  const globalFilter = table.getState().globalFilter;

  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        className="max-w-sm"
        type="text"
        placeholder="Filter by name or category..."
        value={globalFilter ?? ''}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
      />
      <div className="flex items-center">
        <FreezeColumnToggleButton table={table} />
        <DataColumnToggleButton table={table} />
      </div>
    </div>
  );
};
