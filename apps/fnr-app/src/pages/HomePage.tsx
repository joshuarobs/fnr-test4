import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, useToast } from '@react-monorepo/shared';
import { ROUTES } from '../routes';
import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { useGetClaimsQuery } from '../store/services/api';
import { TestTableUXStuff } from '../components/contents-table/TestTableUXStuff';
import { TestTableUXStuffPure } from '../components/contents-table/TestTableUXStuffPure';

export const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: claims, isLoading, error } = useGetClaimsQuery();

  if (isLoading) {
    return <div className="p-4">Loading claims...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

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
        <Button onClick={() => navigate(ROUTES.LOGIN)} variant="outline">
          Login
        </Button>
        <Button onClick={() => navigate(ROUTES.SIGN_UP)} variant="outline">
          Sign Up
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
        <DetailedClaimsTable claims={claims} />
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
