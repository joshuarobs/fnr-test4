import React from 'react';
import { Input } from '@react-monorepo/shared';

// Component to display when a claim is not found or there's an error loading it
export const ClaimNotFoundErrorSection = ({
  claimId,
  claimInput,
  setClaimInput,
  onNavigate,
}: {
  claimId: string;
  claimInput: string;
  setClaimInput: (value: string) => void;
  onNavigate: (claimNumber: string) => void;
}) => {
  return (
    <div className="flex-1 min-w-0 p-4 flex flex-col items-center justify-center gap-4">
      <div className="text-xl font-semibold text-red-500">
        Error Loading Claim
      </div>
      <div className="text-muted-foreground">Claim #{claimId}</div>
      <div className="text-muted-foreground">Try a different claim number</div>
      <div className="flex gap-2">
        <Input
          value={claimInput}
          onChange={(e) => setClaimInput(e.target.value)}
          placeholder="Enter claim number"
          className="w-64"
        />
        <button
          onClick={() => onNavigate(claimInput)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Go
        </button>
      </div>
    </div>
  );
};
