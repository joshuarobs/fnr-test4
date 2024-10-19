import { ColumnDef } from '@tanstack/react-table';
import { Item } from './item';
import { ModelSerialCell } from './ModelSerialCell';
import { BrowseLinkButton } from './BrowseLinkButton';
import { ItemStatusBadge } from './ItemStatusBadge';

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
        <div className="flex items-center w-full">
          <span className="flex-grow text-left truncate">{name}</span>
          <div className="flex justify-center mx-4">
            <BrowseLinkButton
              tooltipText="Search for item in Google in a new tab"
              searchText={name}
            />
          </div>
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
    cell: ({ row }) => {
      const status = row.getValue('status') as Item['status'];
      return <ItemStatusBadge status={status} />;
    },
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
