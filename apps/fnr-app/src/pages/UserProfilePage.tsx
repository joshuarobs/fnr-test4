import { Card } from '@react-monorepo/shared';

// User profile page component that displays user information and settings
export const UserProfilePage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
            {/* Add profile information content here */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePage;
