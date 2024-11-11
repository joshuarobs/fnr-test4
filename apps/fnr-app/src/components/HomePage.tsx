import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@react-monorepo/shared';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Claims Management System
      </h1>
      <Button onClick={() => navigate(`/claim/NRA245279610`)}>
        Go to Claim NRA245279610
      </Button>
    </div>
  );
};
