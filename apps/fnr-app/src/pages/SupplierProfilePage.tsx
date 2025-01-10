import { Card } from '@react-monorepo/shared';
import { Navigate, useParams } from 'react-router-dom';
import { UserAvatar } from '../components/app-shell/UserAvatar';
import { useGetSuppliersQuery } from '../store/services/api';

// Supplier profile page component that displays supplier information
export const SupplierProfilePage = () => {
  const { supplierId } = useParams();

  if (!supplierId) {
    return <Navigate to="/" />;
  }

  const {
    data: suppliers,
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useGetSuppliersQuery();

  // Find the specific supplier
  const supplier = suppliers?.find((s) => s.supplier.supplierId === supplierId);

  if (suppliersLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
        <Card className="p-6">Loading supplier details...</Card>
      </div>
    );
  }

  if (suppliersError || !supplier) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supplier Profile</h1>
        <Card className="p-6">Failed to load supplier details.</Card>
      </div>
    );
  }

  const name = `${supplier.firstName} ${supplier.lastName}`;
  const initials =
    `${supplier.firstName[0]}${supplier.lastName[0]}`.toUpperCase();
  const company = supplier.supplier.company;
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
              name={name}
              userInitials={initials}
              department={company}
              location={location}
              showHeaderRing
            />
            <div>
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground">Supplier</p>
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
                <p className="text-sm">Company: {supplier.supplier.company}</p>
                <p className="text-sm">
                  Allocated Claims: {supplier.supplier.allocatedClaims}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupplierProfilePage;
