import React from 'react';
import { Input } from '@react-monorepo/shared';
import { Table } from '@tanstack/react-table';
import { DataColumnToggleButton } from './DataColumnToggleButton';

interface ContentsTableToolbarProps<TData> {
  table: Table<TData>;
}

export const ContentsTableToolbar = <TData,>({
  table,
}: ContentsTableToolbarProps<TData>) => {
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
      <DataColumnToggleButton table={table} />
    </div>
  );
};
