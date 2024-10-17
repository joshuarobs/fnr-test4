export interface Item {
  id: string;
  category: string;
  modelSerialNumber?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'RS' | 'NR' | 'VPOL';
  item: string;
}

export const placeholderContentsData: Item[] = [
  {
    id: '1',
    category: 'Electronics',
    modelSerialNumber: 'LT-2023-XPS15',
    date: '2023-05-01',
    dueDate: '2023-05-15',
    amount: 1500.0,
    status: 'RS',
    item: 'Laptop',
  },
  {
    id: '2',
    category: 'Furniture',
    date: '2023-05-05',
    dueDate: '2023-05-19',
    amount: 2300.5,
    status: 'NR',
    item: 'Office Desk',
  },
  {
    id: '3',
    category: 'Software',
    modelSerialNumber: 'AV-2023-PRO',
    date: '2023-04-15',
    dueDate: '2023-04-29',
    amount: 1800.75,
    status: 'VPOL',
    item: 'Antivirus License',
  },
  {
    id: '4',
    category: 'Electronics',
    modelSerialNumber: 'SM-G-S23-ULTRA',
    date: '2023-06-01',
    dueDate: '2023-06-15',
    amount: 1200.0,
    status: 'RS',
    item: 'Smartphone',
  },
  {
    id: '5',
    category: 'Food',
    date: '2023-06-10',
    dueDate: '2023-06-24',
    amount: 150.25,
    status: 'NR',
    item: 'Groceries',
  },
];
