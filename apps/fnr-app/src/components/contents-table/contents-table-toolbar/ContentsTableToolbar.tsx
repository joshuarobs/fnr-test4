import React from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '@react-monorepo/shared';
import { DataColumnToggleButton } from './DataColumnToggleButton';
import { FreezeColumnToggleButton } from './FreezeColumnToggleButton';
import { Item } from '../item';

interface ContentsTableToolbarProps<TData> {
  table: Table<TData>;
  frozenColumnKeys: (keyof Item)[];
  setFrozenColumnKeys: React.Dispatch<React.SetStateAction<(keyof Item)[]>>;
}

export function ContentsTableToolbar<TData>({
  table,
  frozenColumnKeys,
  setFrozenColumnKeys,
}: ContentsTableToolbarProps<TData>) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter items..."
        value={(table.getState().globalFilter as string) ?? ''}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="ml-auto flex items-center space-x-2">
        <FreezeColumnToggleButton
          table={table}
          frozenColumnKeys={frozenColumnKeys}
          setFrozenColumnKeys={setFrozenColumnKeys}
        />
        <DataColumnToggleButton table={table} />
      </div>
    </div>
  );
}
