import type { Meta, StoryObj } from '@storybook/react';
import { PartyAvatarSection } from './PartyAvatarSection';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { UserProvider } from '../providers/UserContext';

/**
 * A section component that displays a group of user avatars with an optional title.
 * Supports both staff and supplier avatars, with different layouts based on the number of avatars.
 */
export default {
  title: 'Navigation/PartyAvatarSection',
  component: PartyAvatarSection,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <UserProvider>
            <div style={{ padding: '1rem', maxWidth: '300px' }}>
              <Story />
            </div>
          </UserProvider>
        </Provider>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Title of the avatar section',
      control: 'text',
    },
    avatars: {
      description: 'Array of avatar data objects',
      control: 'object',
    },
  },
} as Meta<typeof PartyAvatarSection>;

type Story = StoryObj<typeof PartyAvatarSection>;

// Default story with two contributors
export const Default: Story = {
  args: {
    title: 'Contributors',
    avatars: [
      {
        userInitials: 'JD',
        name: 'John Doe',
        userId: 1,
        employeeId: 'EMP123',
        color: '#4B5563',
      },
      {
        userInitials: 'JS',
        name: 'Jane Smith',
        userId: 2,
        employeeId: 'EMP456',
        color: '#2563EB',
      },
    ],
  },
};

// Story showing many avatars (horizontal layout)
export const ManyAvatars: Story = {
  args: {
    title: 'Contributors',
    avatars: [
      {
        userInitials: 'JD',
        name: 'John Doe',
        userId: 1,
        employeeId: 'EMP123',
        color: '#4B5563',
      },
      {
        userInitials: 'JS',
        name: 'Jane Smith',
        userId: 2,
        employeeId: 'EMP456',
        color: '#2563EB',
      },
      {
        userInitials: 'RJ',
        name: 'Robert Johnson',
        userId: 3,
        employeeId: 'EMP789',
        color: '#059669',
      },
      {
        userInitials: 'AL',
        name: 'Alice Lee',
        userId: 4,
        employeeId: 'EMP101',
        color: '#DC2626',
      },
    ],
  },
};

// Story showing suppliers
export const Suppliers: Story = {
  args: {
    title: 'Suppliers',
    avatars: [
      {
        companyName: 'Acme Corporation',
        name: 'Acme Corp',
        userId: 1,
        supplierId: 'SUP123',
        color: '#4B5563',
        isSupplier: true,
      },
      {
        companyName: 'Tech Solutions Ltd',
        name: 'Tech Solutions',
        userId: 2,
        supplierId: 'SUP456',
        color: '#2563EB',
        isSupplier: true,
      },
    ],
  },
};

// Story without title
export const NoTitle: Story = {
  args: {
    avatars: [
      {
        userInitials: 'JD',
        name: 'John Doe',
        userId: 1,
        employeeId: 'EMP123',
        color: '#4B5563',
      },
      {
        userInitials: 'JS',
        name: 'Jane Smith',
        userId: 2,
        employeeId: 'EMP456',
        color: '#2563EB',
      },
    ],
  },
};
