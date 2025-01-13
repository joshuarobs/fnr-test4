import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';

// This page shows all the claims the user has visited
export const HistoryPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <p className="text-muted-foreground mb-4">
        Your recently visited claims will appear here.
      </p>
      <DetailedClaimsTable queryType="recent" />
    </div>
  );
};

export default HistoryPage;
