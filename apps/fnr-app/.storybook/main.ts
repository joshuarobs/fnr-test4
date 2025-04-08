import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: ['@storybook/blocks', '@storybook/test'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'apps/fnr-app/vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: true,
  },
};

export default config;
