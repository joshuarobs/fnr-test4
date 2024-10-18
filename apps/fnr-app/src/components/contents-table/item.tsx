export type Item = {
  id: string;
  category: string;
  modelSerialNumber?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'RS' | 'NR' | 'VPOL';
  item: string;
};
