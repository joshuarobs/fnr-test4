import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { ItemStatus } from './ItemStatus';
import { ItemStatusBadge } from './ItemStatusBadge';
import { Input } from '@react-monorepo/shared';

// Sample product data
const ProductService = [
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    itemStatus: ItemStatus.RS,
  },
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    itemStatus: ItemStatus.NR,
  },
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
    itemStatus: ItemStatus.VPOL,
  },
];

interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  itemStatus: (typeof ItemStatus)[keyof typeof ItemStatus];
}

export const TestTableUXStuff: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(ProductService);

  const columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
    { field: 'itemStatus', header: 'Status' },
    { field: 'quantity', header: 'Quantity' },
    { field: 'price', header: 'Price' },
  ];

  // Validates if value is a positive integer
  const isPositiveInteger = (val: any): boolean => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, '') || '0';
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  };

  // Handles cell edit completion
  const onCellEditComplete = (e: any) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case 'quantity':
      case 'price':
        if (isPositiveInteger(newValue)) rowData[field] = newValue;
        else event.preventDefault();
        break;

      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };

  // Cell editor component selector
  const cellEditor = (options: any) => {
    if (options.field === 'code') {
      return (
        <InputText
          type="text"
          value={options.value}
          onChange={(e) => options.editorCallback(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
        />
      );
    }
    return textEditor(options);
  };

  // Text input editor with shadcn Input
  const textEditor = (options: any) => {
    return (
      <Input
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onBlur={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        autoFocus
        className="px-2 py-1 text-left"
      />
    );
  };

  // Price input editor
  const priceEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };

  // Price display formatter
  const priceBodyTemplate = (rowData: Product) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(rowData.price);
  };

  // Status display formatter
  const statusBodyTemplate = (rowData: Product) => {
    return <ItemStatusBadge itemStatus={rowData.itemStatus} />;
  };

  return (
    <div className="card p-fluid">
      <DataTable
        value={products}
        editMode="cell"
        tableStyle={{ minWidth: '50rem' }}
      >
        {columns.map(({ field, header }) => (
          <Column
            key={field}
            field={field}
            header={header}
            style={{ width: '25%' }}
            body={
              field === 'price'
                ? priceBodyTemplate
                : field === 'itemStatus'
                ? statusBodyTemplate
                : undefined
            }
            editor={
              field !== 'itemStatus'
                ? (options) => cellEditor(options)
                : undefined
            }
            onCellEditComplete={onCellEditComplete}
          />
        ))}
      </DataTable>
    </div>
  );
};
