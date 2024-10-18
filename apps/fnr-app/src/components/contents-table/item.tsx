export type Item = {
  id: string;
  group: string;
  name: string;
  category: string;
  modelSerialNumber?: string;
  status: 'RS' | 'NR' | 'VPOL';
  oisquote: number;
  ourquote: number;
  difference: number;

  date: string;
  dueDate: string;
  amount: number;
};
