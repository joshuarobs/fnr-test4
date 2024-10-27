export type Activity = {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  timestamp: Date;
};

export const placeholderLatestActivities: Activity[] = [
  {
    id: 1,
    user: {
      name: 'John Doesmith',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Updated quote for "2x Clothes" (ID: 1) for $50',
    timestamp: new Date(2024, 0, 15, 14, 30),
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Added new item "Kitchen Appliance" (ID: 2)',
    timestamp: new Date(2024, 0, 15, 13, 45),
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Modified description for "Electronics" (ID: 3)',
    timestamp: new Date(2024, 0, 15, 12, 15),
  },
];
