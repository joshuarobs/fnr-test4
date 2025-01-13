import { Card } from '@react-monorepo/shared';
import { Navigate, useParams } from 'react-router-dom';
import { UserAvatar } from '../components/app-shell/UserAvatar';
import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import { useGetSupplierQuery } from '../store/services/api';
import { getCompanyInitials } from '../lib/avatar-utils';

// Supplier profile page component that displays supplier information
export const SupplierProfilePage = () => {
  const { supplierId } = useParams();

  if (!supplierId) {
    return <Navigate to="/" />;
  }

  const {
    data: supplier,
    isLoading: supplierLoading,
    error: supplierError,
  } = useGetSupplierQuery(supplierId);

  if (supplierLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
        <Card className="p-6">Loading supplier details...</Card>
      </div>
    );
  }

  if (supplierError || !supplier) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
        <Card className="p-6">Failed to load supplier details.</Card>
      </div>
    );
  }

  const company = supplier.supplier.company;
  const initials = getCompanyInitials(company);
  const location = 'Australia'; // Default location for suppliers

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              size="lg"
              color={supplier.avatarColour || '#6B7280'} // Fallback to default gray if no color
              name={company}
              userInitials={initials}
              department={company}
              location={location}
              showHeaderRing
            />
            <div>
              <h2 className="text-lg font-semibold">
                {supplier.supplier.company}
              </h2>
              <p className="text-sm text-muted-foreground">{supplier.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">Email: {supplier.email}</p>
                {supplier.phone && (
                  <p className="text-sm">Phone: {supplier.phone}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">
                Supplier Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Supplier ID: {supplier.supplier.supplierId}
                </p>
                <p className="text-sm">
                  Allocated Claims: {supplier.supplier.allocatedClaims || 0}
                </p>
                <p className="text-sm">Location: {location}</p>
                <p className="text-sm">Status: Active</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Claims Table Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Allocated Claims</h2>
        <DetailedClaimsTable queryType="supplier" supplierId={supplierId} />
      </div>
    </div>
  );
};

export default SupplierProfilePage;
