import { ColumnDef } from '@tanstack/react-table';
import { Item } from './item';

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'group',
    header: 'Group',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
];
