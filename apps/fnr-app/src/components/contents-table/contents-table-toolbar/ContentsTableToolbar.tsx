import React from 'react';
import { Input, Button } from '@react-monorepo/shared';
import { Table } from '@tanstack/react-table';
import { DataColumnToggleButton } from './DataColumnToggleButton';

interface ContentsTableToolbarProps<TData> {
  table: Table<TData>;
}

export const ContentsTableToolbar = <TData,>({
  table,
}: ContentsTableToolbarProps<TData>) => {
  const [filterValue, setFilterValue] = React.useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterValue(value);
    table.setGlobalFilter(value);
  };

  const toggleColumnVisibility = () => {
    const newVisibility = table.getAllColumns().reduce((acc, column) => {
      acc[column.id] = !table.getColumn(column.id)?.getIsVisible();
      return acc;
    }, {} as Record<string, boolean>);
    table.setColumnVisibility(newVisibility);
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Input
        className="max-w-sm"
        type="text"
        placeholder="Filter items..."
        value={filterValue}
        onChange={handleFilterChange}
      />
      <DataColumnToggleButton table={table} />
    </div>
  );
};
