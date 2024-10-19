import { ColumnDef } from '@tanstack/react-table';
import { Item } from './item';
import { ModelSerialCell } from './ModelSerialCell';
import { BrowseLinkButton } from './BrowseLinkButton';

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
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return name ? (
        <div>
          {name}
          <BrowseLinkButton tooltipText="Search for item in Google in a new tab" />
        </div>
      ) : null;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'modelSerialNumber',
    header: 'Model/Serial number',
    cell: ({ row }) => {
      const modelSerialNumber = row.getValue('modelSerialNumber');
      return modelSerialNumber ? (
        <ModelSerialCell modelSerialNumber={modelSerialNumber as string} />
      ) : null;
    },
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
