import type { Meta, StoryObj } from '@storybook/react';
import { NavAvatar } from './NavAvatar';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { UserProvider } from '../providers/UserContext';

/**
 * A navigation avatar component that displays user information and optionally links to their profile.
 * Supports various display options and can be used for both staff and supplier profiles.
 */
export default {
  title: 'Navigation/NavAvatar',
  component: NavAvatar,
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
    userInitials: {
      description: 'Initials to display in the avatar',
      control: 'text',
    },
    color: {
      description: 'Background color of the avatar',
      control: 'color',
    },
    name: {
      description: 'Full name of the user',
      control: 'text',
    },
    userId: {
      description: 'Unique identifier for the user',
      control: 'number',
    },
    employeeId: {
      description: 'Employee ID for staff members',
      control: 'text',
    },
    supplierId: {
      description: 'Supplier ID for supplier users',
      control: 'text',
    },
    department: {
      description: 'Department the user belongs to',
      control: 'text',
    },
    disableNavigation: {
      description: 'Prevents the avatar from being clickable',
      control: 'boolean',
    },
    showHeaderRing: {
      description: 'Shows a ring around the avatar',
      control: 'boolean',
    },
    disableHoverText: {
      description: 'Disables hover effects on the text',
      control: 'boolean',
    },
    disableHoverCard: {
      description: 'Disables the hover card feature',
      control: 'boolean',
    },
    hideTextLabel: {
      description: 'Hides the name label next to the avatar',
      control: 'boolean',
    },
    mini: {
      description: 'Uses a smaller size for the avatar and text',
      control: 'boolean',
    },
    companyName: {
      description: 'Company name to generate initials from',
      control: 'text',
    },
    isSupplier: {
      description: 'Indicates if the user is a supplier',
      control: 'boolean',
    },
  },
} as Meta<typeof NavAvatar>;
type Story = StoryObj<typeof meta>;

// Default story with basic props
export const Default: Story = {
  args: {
    userInitials: 'JD',
    name: 'John Doe',
    userId: 1,
    employeeId: 'EMP123',
    department: 'Claims',
  },
};

// Story showing company initials
export const WithCompany: Story = {
  args: {
    companyName: 'Acme Corporation',
    name: 'Company Profile',
    color: '#4B5563',
  },
};

// Mini variant story
export const MiniVariant: Story = {
  args: {
    userInitials: 'JD',
    name: 'John Doe with a Very Long Name That Should Be Truncated',
    userId: 1,
    employeeId: 'EMP123',
    department: 'Claims',
    mini: true,
  },
};

// Empty user story
export const EmptyUser: Story = {
  args: {
    userId: undefined,
    name: undefined,
  },
};

// Story with navigation disabled
export const DisabledNavigation: Story = {
  args: {
    userInitials: 'JD',
    name: 'John Doe',
    userId: 1,
    disableNavigation: true,
  },
};

// Story showing supplier variant
export const SupplierVariant: Story = {
  args: {
    userInitials: 'JS',
    name: 'Jane Smith',
    userId: 2,
    supplierId: 'SUP456',
    isSupplier: true,
    color: '#2563EB',
  },
};

// Story showing current user
export const CurrentUser: Story = {
  args: {
    userInitials: 'CU',
    name: 'Current User',
    userId: 1, // Matches the mock context user ID
    employeeId: 'EMP789',
    department: 'Claims',
    color: '#059669',
  },
};
