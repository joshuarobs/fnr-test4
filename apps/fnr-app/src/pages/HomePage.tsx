import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@react-monorepo/shared';
import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { TestTableUXStuff } from '../components/contents-table/TestTableUXStuff';
import { TestTableUXStuffPure } from '../components/contents-table/TestTableUXStuffPure';

export const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Claims Management System
      </h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate(`/claim/NRA245279610`)}>
          Go to Claim NRA245279610
        </Button>
        <Button onClick={() => navigate(`/404`)} variant="outline">
          Go to 404 page
        </Button>
        <Button
          onClick={() =>
            toast({
              title: 'Test Notification',
              description: new Date().toLocaleTimeString(),
            })
          }
        >
          Test Toast
        </Button>
      </div>
      <div className="mt-4">
        <DetailedClaimsTable />
      </div>
      <div className="mt-4">
        <TestTableUXStuff />
      </div>
      <div className="mt-4">
        <TestTableUXStuffPure />
      </div>
    </div>
  );
};
