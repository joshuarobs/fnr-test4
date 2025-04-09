import type { Meta, StoryObj } from '@storybook/react';
import { OurQuoteCell } from './OurQuoteCell';

/**
 * A table cell component that displays and allows editing of our quote amount.
 * Features:
 * - Editable input field with number validation
 * - Formats quote values based on quantity
 * - Shows quote proof link icon with URL management
 * - Allows adding/editing quote proof URLs
 */
const meta = {
  title: 'Table/Cells/OurQuoteCell',
  component: OurQuoteCell,
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
      description: 'The item data containing quote and proof information',
    },
    claimNumber: {
      description: 'The claim number associated with this item',
    },
    updateItem: {
      description:
        'Callback function called when the quote or proof URL is updated',
    },
  },
} satisfies Meta<typeof OurQuoteCell>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with a quote value
export const WithQuote: Story = {
  args: {
    item: {
      ourQuote: 1500.5,
      quantity: 1,
      ourQuoteProof: null,
    },
    claimNumber: 'CLM-123',
    updateItem: (item, claimNumber) =>
      console.log('Updated item:', item, 'Claim:', claimNumber),
  },
};

// Story showing empty/null quote
export const EmptyQuote: Story = {
  args: {
    item: {
      ourQuote: null,
      quantity: 1,
      ourQuoteProof: null,
    },
    claimNumber: 'CLM-123',
    updateItem: (item, claimNumber) =>
      console.log('Updated item:', item, 'Claim:', claimNumber),
  },
};

// Story showing quote with proof URL
export const WithQuoteProof: Story = {
  args: {
    item: {
      ourQuote: 750.25,
      quantity: 1,
      ourQuoteProof: 'https://example.com/quote-proof.pdf',
    },
    claimNumber: 'CLM-123',
    updateItem: (item, claimNumber) =>
      console.log('Updated item:', item, 'Claim:', claimNumber),
  },
};

// Story showing quote with quantity greater than 1
export const WithQuantity: Story = {
  args: {
    item: {
      ourQuote: 100,
      quantity: 5,
      ourQuoteProof: null,
    },
    claimNumber: 'CLM-123',
    updateItem: (item, claimNumber) =>
      console.log('Updated item:', item, 'Claim:', claimNumber),
  },
};
