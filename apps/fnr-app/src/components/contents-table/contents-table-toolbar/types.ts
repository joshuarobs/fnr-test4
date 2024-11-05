import { ComponentType } from 'react';

export interface OptionItem {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}

export interface OptionGroups {
  headerGroup?: OptionItem[];
  mainGroup: OptionItem[];
  footerGroup?: OptionItem[];
}
