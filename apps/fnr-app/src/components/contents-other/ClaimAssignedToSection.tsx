import { Badge, Button } from '@react-monorepo/shared';
import { NavAvatar } from './NavAvatar';

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
        <NavAvatar
          userInitials={assignedUser.userInitials}
          color={assignedUser.color}
          name={assignedUser.name}
          userId={assignedUser.userId}
        />
      ) : (
        <span className="text-sm text-muted-foreground">Not assigned</span>
      )}
    </div>
  );
};
