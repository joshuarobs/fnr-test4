import { Badge, Button } from '@react-monorepo/shared';
import { UserAvatar } from '../app-shell/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { getUserRoute } from '../../routes';

interface AssignedUserData {
  userInitials: string;
  color?: string;
  name: string;
  userId: string;
}

interface ClaimAssignedToSectionProps {
  // The currently assigned user data (optional since claim might not be assigned)
  assignedUser?: AssignedUserData;
  // Callback when Assign button is clicked
  onAssignClick: () => void;
}

// Component for displaying the assigned user in a claim
// Shows a single user with their avatar and full details
// Includes an Assign button for reassigning the claim
export const ClaimAssignedToSection = ({
  assignedUser,
  onAssignClick,
}: ClaimAssignedToSectionProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Title row with Assign button */}
      <div className="flex items-center w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Assigned to</span>
        </div>
      </div>

      {/* Always show full detail view since we only have one user */}
      {assignedUser ? (
        <div
          className="flex items-center gap-2 cursor-pointer hover:text-hover-blue"
          onClick={() => {
            if (assignedUser.userId) {
              navigate(getUserRoute(assignedUser.userId));
            }
          }}
        >
          <div className="border-2 border-border rounded-full">
            <UserAvatar
              size="sm"
              userInitials={assignedUser.userInitials}
              color={assignedUser.color}
              showHeaderRing
              name={assignedUser.name}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {assignedUser.name || assignedUser.userInitials}
          </span>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Not assigned</span>
      )}
    </div>
  );
};
