import type { Meta, StoryObj } from '@storybook/react';
import { QuoteDifferenceIcon } from './QuoteDifferenceIcon';
import { TooltipProvider } from '@react-monorepo/shared';

/**
 * A component that visually represents the difference between an insured's quote and our quote.
 * Shows different icons and colors based on whether the insured's quote is higher, lower, or equal.
 * - Green tick for equal quotes
 * - Red up arrow when insured's quote is higher
 * - Green down arrow when insured's quote is lower
 */
export default {
  title: 'Table/QuoteDifferenceIcon',
  component: QuoteDifferenceIcon,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div style={{ padding: '1rem' }}>
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    insuredsQuote: {
      description: "The insured's quoted amount",
      control: 'number',
    },
    ourQuote: {
      description: 'Our quoted amount',
      control: 'number',
    },
    showDollarSign: {
      description: 'Whether to show the $ symbol before the difference amount',
      control: 'boolean',
    },
  },
} as Meta<typeof QuoteDifferenceIcon>;

type Story = StoryObj<typeof QuoteDifferenceIcon>;

// Story showing equal quotes (green tick)
export const EqualQuotes: Story = {
  args: {
    insuredsQuote: 1000,
    ourQuote: 1000,
    showDollarSign: false,
  },
};

// Story showing higher insured quote (red up arrow)
export const HigherInsuredQuote: Story = {
  args: {
    insuredsQuote: 1500,
    ourQuote: 1000,
    showDollarSign: true,
  },
};

// Story showing lower insured quote (green down arrow)
export const LowerInsuredQuote: Story = {
  args: {
    insuredsQuote: 800,
    ourQuote: 1000,
    showDollarSign: true,
  },
};

// Story showing small difference
export const SmallDifference: Story = {
  args: {
    insuredsQuote: 1000.5,
    ourQuote: 1000,
    showDollarSign: true,
  },
};

// Story showing large difference
export const LargeDifference: Story = {
  args: {
    insuredsQuote: 2500,
    ourQuote: 1000,
    showDollarSign: true,
  },
};
