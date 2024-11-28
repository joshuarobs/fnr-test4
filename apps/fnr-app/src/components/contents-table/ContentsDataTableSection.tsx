import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Item } from './item';
import { ItemNameCell } from './cells/ItemNameCell';
import { ItemStatusBadge } from './ItemStatusBadge';
import { InputText } from 'primereact/inputtext';

interface ContentsDataTableSectionProps {
  data: Item[];
}

export const ContentsDataTableSection = ({
  data,
}: ContentsDataTableSectionProps) => {
  // Transform the data to match the expected format and sort by localId
  const transformedData = data
    .map((item) => ({
      id: item.localId,
      name: item.name,
      status: item.itemStatus,
      room: item.roomCategory,
      category: item.category,
      modelSerial: item.modelSerialNumber,
      quantity: item.quantity,
      insuredQuote: item.insuredsQuote || 0,
      ourQuote: item.ourQuote || 0,
      // Calculate the difference between our quote and insured's quote
      difference: (item.ourQuote || 0) - (item.insuredsQuote || 0),
    }))
    .sort((a, b) => a.id - b.id); // Sort by id (localId) in ascending order

  // Format currency values
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const [selectedCell, setSelectedCell] = useState(null);

  const handleUpdateItem = (updatedItem: Item) => {
    // TODO: Implement item update logic
    console.log('Item updated:', updatedItem);
  };

  const nameBodyTemplate = (rowData: any) => {
    return <ItemNameCell rowData={rowData} updateItem={handleUpdateItem} />;
  };

  const statusBodyTemplate = (rowData: any) => {
    return <ItemStatusBadge itemStatus={rowData.status} />;
  };

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e: any) => options.editorCallback(e.target.value)}
        style={{ width: '100%' }}
      />
    );
  };

  // The condition we check every row for, if we can edit this row or not
  const allowEdit = (rowData: any) => {
    return rowData.name !== 'Blue Band';
  };

  return (
    <DataTable
      value={transformedData}
      tableStyle={{ minWidth: '50rem' }}
      showGridlines
      stripedRows
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50]}
      removableSort
      cellSelection
      scrollable
      selectionMode="single"
      selection={selectedCell}
      editMode="row"
      onSelectionChange={(e: any) => setSelectedCell(e.value)}
    >
      <Column
        field="id"
        header="ID"
        sortable
        style={{ width: '5%' }}
        frozen
      ></Column>
      <Column
        field="name"
        header="Name"
        sortable
        style={{ minWidth: '260px' }}
        frozen
        body={nameBodyTemplate}
      ></Column>
      <Column
        field="status"
        header="Status"
        sortable
        style={{ width: '10%' }}
        frozen
        body={statusBodyTemplate}
      ></Column>
      <Column
        field="room"
        header="Room"
        sortable
        style={{ width: '10%' }}
      ></Column>
      <Column
        field="category"
        header="Category"
        sortable
        style={{ width: '10%' }}
      ></Column>
      <Column
        field="modelSerial"
        header="Model/Serial"
        sortable
        style={{ width: '15%' }}
      ></Column>
      <Column
        field="quantity"
        header="Qty"
        sortable
        editor={(options) => textEditor(options)}
        style={{ maxWidth: '100px', textAlign: 'right' }}
        frozen
        alignFrozen="right"
      ></Column>
      <Column
        field="insuredQuote"
        header="Insured's Quote"
        sortable
        style={{ width: '10%', textAlign: 'right' }}
        body={(rowData) => formatCurrency(rowData.insuredQuote)}
        frozen
        alignFrozen="right"
      ></Column>
      <Column
        field="difference"
        header="Diff."
        sortable
        style={{ width: '10%', textAlign: 'right' }}
        body={(rowData) => formatCurrency(rowData.difference)}
        frozen
        alignFrozen="right"
      ></Column>
      <Column
        field="ourQuote"
        header="Our Quote"
        sortable
        style={{ width: '10%', textAlign: 'right' }}
        body={(rowData) => formatCurrency(rowData.ourQuote)}
        frozen
        alignFrozen="right"
      ></Column>
      <Column
        rowEditor={allowEdit}
        headerStyle={{ width: '10%', minWidth: '8rem' }}
        bodyStyle={{ textAlign: 'center' }}
        frozen
        alignFrozen="right"
      ></Column>
    </DataTable>
  );
};
