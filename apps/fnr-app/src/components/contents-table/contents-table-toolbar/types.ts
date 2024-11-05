import { ReactNode } from 'react';

export interface OptionItem {
  label: string;
  value: string | null;
  icon?: any;
}

export interface FilterOption extends OptionItem {
  getCount?: (facets: Map<string | number | null, number>) => number;
}

export interface OptionGroups {
  headerGroup?: FilterOption[];
  mainGroup: FilterOption[];
  footerGroup?: FilterOption[];
}
