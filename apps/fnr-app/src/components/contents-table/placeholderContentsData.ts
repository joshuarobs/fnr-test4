export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export const placeholderContentsData: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    date: '2023-05-01',
    dueDate: '2023-05-15',
    amount: 1500.0,
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    date: '2023-05-05',
    dueDate: '2023-05-19',
    amount: 2300.5,
    status: 'Pending',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    date: '2023-04-15',
    dueDate: '2023-04-29',
    amount: 1800.75,
    status: 'Overdue',
  },
  // Add more invoice data as needed
];
