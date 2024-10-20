import '@tanstack/react-table';

// Solution from Github
// This is so we can set a min width for the Shadcn Data Table
// https://github.com/shadcn-ui/ui/issues/2854
// See full snippet: https://gist.github.com/mxkaske/4f87a26bbba3486d2f2c0c83f60163eb

declare module '@tanstack/react-table' {
  interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
  }
}
