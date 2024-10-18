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
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'modelSerialNumber',
    header: 'Model/Serial number',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'oisquote',
    header: "Insured's quote",
  },
  {
    accessorKey: 'ourquote',
    header: 'Our quote',
  },
  {
    accessorKey: 'difference',
    header: 'Difference',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
  },
];
