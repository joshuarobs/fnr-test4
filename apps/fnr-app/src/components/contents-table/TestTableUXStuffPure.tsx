import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

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
}

interface EditingCell {
  rowIndex: number;
  field: string;
}

export const TestTableUXStuffPure: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(ProductService);
  // Track selected cell and editing state
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    field: string;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const columns = [
    { field: 'code', header: 'Code' },
    { field: 'name', header: 'Name' },
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

  // Handle keyboard navigation
  const onSelectionChange = (e: any) => {
    const { rowIndex, field } = e.value || {};
    if (rowIndex !== undefined && field) {
      setSelectedCell({ rowIndex, field });
      setEditingCell({ rowIndex, field });
    }
  };

  // Handle tab key navigation
  const onEditorKeyDown = (
    e: React.KeyboardEvent,
    options: { rowIndex: number; field: string }
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent default tab behavior

      const currentColIndex = columns.findIndex(
        (col) => col.field === options.field
      );
      const nextColIndex = e.shiftKey
        ? currentColIndex - 1
        : currentColIndex + 1;
      const currentRowIndex = options.rowIndex;

      let nextRowIndex = currentRowIndex;
      let nextField = options.field;

      // Calculate next position
      if (nextColIndex >= 0 && nextColIndex < columns.length) {
        // Move to next/previous column in same row
        nextField = columns[nextColIndex].field;
      } else if (
        !e.shiftKey &&
        nextColIndex >= columns.length &&
        currentRowIndex < products.length - 1
      ) {
        // Move to first column of next row
        nextRowIndex = currentRowIndex + 1;
        nextField = columns[0].field;
      } else if (e.shiftKey && nextColIndex < 0 && currentRowIndex > 0) {
        // Move to last column of previous row
        nextRowIndex = currentRowIndex - 1;
        nextField = columns[columns.length - 1].field;
      }

      // Only update if we have a valid next position
      if (nextField !== options.field || nextRowIndex !== currentRowIndex) {
        const nextCell = {
          rowIndex: nextRowIndex,
          field: nextField,
        };
        setSelectedCell(nextCell);
        setEditingCell(nextCell);
      }
    }
  };

  // Cell editor component selector
  const cellEditor = (options: any) => {
    const editorProps = {
      ...options,
      onKeyDown: (e: React.KeyboardEvent) => onEditorKeyDown(e, options),
    };

    if (options.field === 'price') {
      return priceEditor(editorProps);
    }
    return textEditor(editorProps);
  };

  // Text input editor with primereact InputText
  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onBlur={(e) => options.editorCallback(e.target.value)}
        onKeyDown={options.onKeyDown}
        className="px-2 py-1 text-left"
        autoFocus
      />
    );
  };

  // Price input editor
  const priceEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        onKeyDown={options.onKeyDown}
        mode="currency"
        currency="USD"
        locale="en-US"
        autoFocus
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

  return (
    <div className="card p-fluid">
      <DataTable
        value={products}
        editMode="cell"
        tableStyle={{ minWidth: '50rem' }}
        cellSelection
        showGridlines
        selectionMode="single"
        selection={selectedCell}
        onSelectionChange={onSelectionChange}
        editingRows={editingCell ? [products[editingCell.rowIndex]] : []}
      >
        {columns.map(({ field, header }) => (
          <Column
            key={field}
            field={field}
            header={header}
            style={{ width: '25%' }}
            body={field === 'price' ? priceBodyTemplate : undefined}
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
        ))}
      </DataTable>
    </div>
  );
};
