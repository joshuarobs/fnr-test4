import React from 'react';
import { Table } from '@tanstack/react-table';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@react-monorepo/shared';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { ShortReadibleColumnNames } from '../columns';
import { Item } from '../item';

interface FreezeColumnToggleButtonProps {
  table: Table<Item>;
}

export function FreezeColumnToggleButton({
  table,
}: FreezeColumnToggleButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mr-2 select-none">
          <LockClosedIcon className="mr-2 h-4 w-4" />
          Freeze Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Freeze Columns</div>
          <div className="space-y-2">
            {table.getAllColumns().map((column) => {
              // Skip the actions column
              if (column.id === 'actions') return null;

              const columnName =
                ShortReadibleColumnNames[
                  column.id as keyof typeof ShortReadibleColumnNames
                ] || column.id;

              return (
                <div
                  key={column.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{columnName}</span>
                  <div className="space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Freeze to left"
                    >
                      L
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Freeze to right"
                    >
                      R
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
