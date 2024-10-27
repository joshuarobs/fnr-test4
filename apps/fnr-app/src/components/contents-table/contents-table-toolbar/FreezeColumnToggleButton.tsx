import React from 'react';
import { Table } from '@tanstack/react-table';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { LockClosedIcon } from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@react-monorepo/shared';
import { ShortReadibleColumnNames } from '../columns';
import { Item } from '../item';

interface FreezeColumnToggleButtonProps {
  table: Table<Item>;
  frozenColumnKeys: (keyof Item)[];
  setFrozenColumnKeys: React.Dispatch<React.SetStateAction<(keyof Item)[]>>;
}

export function FreezeColumnToggleButton({
  table,
  frozenColumnKeys,
  setFrozenColumnKeys,
}: FreezeColumnToggleButtonProps) {
  const handleFreezeToggle = (columnId: string, checked: boolean) => {
    setFrozenColumnKeys((prev) => {
      if (!checked) {
        return prev.filter((key) => key !== columnId);
      }
      return [...prev, columnId as keyof Item];
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 lg:flex select-none">
          <LockClosedIcon className="mr-2 h-4 w-4 select-none" />
          Freeze
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Freeze columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table.getAllColumns().map((column) => {
          // Skip the actions column
          if (column.id === 'actions') return null;

          const columnName =
            ShortReadibleColumnNames[
              column.id as keyof typeof ShortReadibleColumnNames
            ] || column.id;

          const isFrozen = frozenColumnKeys.includes(column.id as keyof Item);

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={isFrozen}
              onCheckedChange={(checked) =>
                handleFreezeToggle(column.id, checked)
              }
            >
              {columnName}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
