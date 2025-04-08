import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

// Meta information for the component
const meta = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {};

// Development mode story with quick login button
export const WithQuickLogin: Story = {
  parameters: {
    env: {
      DEV: true,
    },
  },
};
