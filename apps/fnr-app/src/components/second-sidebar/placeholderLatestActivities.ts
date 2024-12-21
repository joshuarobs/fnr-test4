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
    timestamp: new Date(), // Just now
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Added new item "Kitchen Appliance" (ID: 2)',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Modified description for "Electronics" (ID: 3)',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 4,
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Reviewed claim details',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: 5,
    user: {
      name: 'Alex Brown',
      avatar: 'https://github.com/shadcn.png',
    },
    action: 'Created new claim',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
];
