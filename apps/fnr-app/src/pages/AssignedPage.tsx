import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';

/**
 * AssignedPage displays claims that are assigned to the current logged-in user
 */
export const AssignedPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Assigned Claims</h1>
      <DetailedClaimsTable queryType="assigned" />
    </div>
  );
};
