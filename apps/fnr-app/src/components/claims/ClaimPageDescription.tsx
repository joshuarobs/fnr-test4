import React from 'react';

// Component to display the claim description
export const ClaimPageDescription = ({
  description,
}: {
  description: string;
}) => {
  return (
    <div className="text-sm text-muted-foreground">
      {description || 'No description provided'}
    </div>
  );
};
