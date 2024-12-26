import { Card } from '@react-monorepo/shared';
import { useParams } from 'react-router-dom';
import { UserAvatar } from '../components/app-shell/UserAvatar';

// User profile page component that displays user information and settings
export const UserProfilePage = () => {
  const { id } = useParams();
  const color = 'bg-blue-600';
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <UserAvatar
              size="lg"
              color={color}
              name="John Doe"
              department="Claims Processing"
              location="Australia"
            />
            <div>
              <h2 className="text-lg font-semibold">John Doe</h2>
              <p className="text-sm text-muted-foreground">AGENT ({id})</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-semibold mb-2">
                Contact Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm">Email: john.doe@example.com</p>
                <p className="text-sm">Phone: (555) 123-4567</p>
              </div>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2">Role Information</h3>
              <div className="space-y-2">
                <p className="text-sm">Role: Claims Agent</p>
                <p className="text-sm">Department: Claims Processing</p>
                <p className="text-sm">Agent ID: {id}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfilePage;
