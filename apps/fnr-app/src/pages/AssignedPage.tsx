import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { Switch } from '@react-monorepo/shared';
import { useState } from 'react';

/**
 * AssignedPage displays claims that are assigned to the current logged-in user
 * Includes a toggle to switch between active and archived claims
 */
export const AssignedPage = () => {
  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Assigned Claims</h1>
        <label className="flex items-center space-x-2 cursor-pointer">
          <span className="text-sm text-gray-600 select-none">
            Show Archived
          </span>
          <Switch
            checked={showArchived}
            onCheckedChange={setShowArchived}
            aria-label="Toggle archived claims"
          />
        </label>
      </div>
      <DetailedClaimsTable queryType="assigned" showArchived={showArchived} />
    </div>
  );
};
