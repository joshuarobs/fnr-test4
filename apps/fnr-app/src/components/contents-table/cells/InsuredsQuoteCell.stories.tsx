import type { Meta, StoryObj } from '@storybook/react';
import { InsuredsQuoteCell } from './InsuredsQuoteCell';

/**
 * A table cell component that displays and allows editing of an insured's quote amount.
 * Features:
 * - Editable input field with number validation
 * - Formats quote values based on quantity
 * - Shows receipt icon if a receipt photo URL is available
 * - Can be set to non-editable mode
 */
const meta = {
  title: 'Table/Cells/InsuredsQuoteCell',
  component: InsuredsQuoteCell,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem', minWidth: '200px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    item: {
      description: 'The item data containing quote and receipt information',
    },
    updateItem: {
      description: 'Callback function called when the quote value is updated',
    },
    isEditable: {
      description: 'Whether the quote value can be edited',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof InsuredsQuoteCell>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with a quote value
export const WithQuote: Story = {
  args: {
    item: {
      insuredsQuote: 1500.5,
      quantity: 1,
      receiptPhotoUrl: null,
    },
    updateItem: (item) => console.log('Updated item:', item),
    isEditable: true,
  },
};

// Story showing empty/null quote
export const EmptyQuote: Story = {
  args: {
    item: {
      insuredsQuote: null,
      quantity: 1,
      receiptPhotoUrl: null,
    },
    updateItem: (item) => console.log('Updated item:', item),
    isEditable: true,
  },
};

// Story showing non-editable state
export const NonEditable: Story = {
  args: {
    item: {
      insuredsQuote: 2000,
      quantity: 1,
      receiptPhotoUrl: null,
    },
    updateItem: (item) => console.log('Updated item:', item),
    isEditable: false,
  },
};

// Story showing quote with receipt
export const WithReceipt: Story = {
  args: {
    item: {
      insuredsQuote: 750.25,
      quantity: 1,
      receiptPhotoUrl: 'https://example.com/receipt.pdf',
    },
    updateItem: (item) => console.log('Updated item:', item),
    isEditable: true,
  },
};

// Story showing quote with quantity greater than 1
export const WithQuantity: Story = {
  args: {
    item: {
      insuredsQuote: 100,
      quantity: 5,
      receiptPhotoUrl: null,
    },
    updateItem: (item) => console.log('Updated item:', item),
    isEditable: true,
  },
};
