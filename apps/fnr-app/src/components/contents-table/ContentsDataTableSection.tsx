import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export const ContentsDataTableSection = () => {
  const products = [
    {
      code: 'test',
      name: 'Hello',
      category: 'accessories',
      quantity: 24,
    },
  ];

  return (
    <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
      <Column field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>
  );
};
