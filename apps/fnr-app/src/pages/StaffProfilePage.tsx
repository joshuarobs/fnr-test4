import { Card } from '@react-monorepo/shared';
import { Navigate, useParams } from 'react-router-dom';
import { UserAvatar } from '../components/app-shell/UserAvatar';
import { DetailedClaimsTable } from '../components/homepage/DetailedClaimsTable';
import {
  useGetStaffQuery,
  useGetAssignedClaimsQuery,
} from '../store/services/api';

// Staff profile page component that displays staff information
export const StaffProfilePage = () => {
  const { employeeId } = useParams();

  if (!employeeId) {
    return <Navigate to="/" />;
  }

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetStaffQuery(employeeId);
  const {
    data: claims,
    isLoading: claimsLoading,
    error: claimsError,
  } = useGetAssignedClaimsQuery({ employeeId });

  if (userLoading || claimsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
        <Card className="p-6">Loading staff details...</Card>
      </div>
    );
  }

  if (userError || !user || claimsError) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
        <Card className="p-6">Failed to load staff details.</Card>
      </div>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const department = user.staff.department;
  const location = 'Australia'; // Default location for staff

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Profile</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              size="lg"
              color={user.avatarColour || '#6B7280'} // Fallback to default gray if no color
              name={name}
              userInitials={initials}
              department={department}
              location={location}
              showHeaderRing
            />
            <div>
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">Email: {user.email}</p>
                {user.phone && <p className="text-sm">Phone: {user.phone}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">Staff Information</h3>
              <div className="space-y-2">
                <p className="text-sm">Department: {user.staff.department}</p>
                <p className="text-sm">Position: {user.staff.position}</p>
                <p className="text-sm">Employee ID: {user.staff.employeeId}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Claims Table Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Assigned Claims</h2>
        <DetailedClaimsTable claims={claims} />
      </div>
    </div>
  );
};

export default StaffProfilePage;
