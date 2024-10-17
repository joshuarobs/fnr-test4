import { Badge } from '@react-monorepo/shared';
import { Invoice } from './placeholderContentsData';

type ItemStatusBadgeProps = {
  status: Invoice['status'];
};

const getStatusDetails = (
  status: Invoice['status']
): {
  variant: 'default' | 'destructive' | 'outline' | 'secondary';
  text: string;
} => {
  switch (status) {
    case 'RS':
      return { variant: 'secondary', text: 'RS' };
    case 'NR':
      return { variant: 'destructive', text: 'N/R' };
    case 'VPOL':
      return { variant: 'default', text: 'VPOL' };
    default:
      return { variant: 'outline', text: '?' };
  }
};

export const ItemStatusBadge = ({ status }: ItemStatusBadgeProps) => {
  const { variant, text } = getStatusDetails(status);
  return <Badge variant={variant}>{text}</Badge>;
};
