import React from 'react';
import { Button } from '@react-monorepo/shared';
import { ContentsTable } from './contents-table/ContentsTable';

const MainContents: React.FC = () => {
  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold mb-4">Main Contents</h2>
      <Button variant={'outline'}>Shared button</Button>
      <Button variant={'default'}>New button</Button>
      <ContentsTable />
    </main>
  );
};

export default MainContents;
