import { UserAvatar } from '../app-shell/UserAvatar';
import { Link } from 'react-router-dom';
import { getStaffRoute } from '../../routes';
import { useUser } from '../providers/UserContext';

interface NavAvatarProps {
  userInitials: string;
  color?: string;
  name?: string;
  userId: string;
  department?: string;
  disableNavigation?: boolean; // Add prop to control navigation behavior
}

// Navigation avatar component with optional name label
export const NavAvatar = ({
  userInitials,
  color,
  name,
  userId,
  department,
  disableNavigation,
}: NavAvatarProps) => {
  const currentUser = useUser();
  const isCurrentUser = userId === currentUser.employeeId;

  const content = (
    <div className="w-fit flex items-center gap-2 cursor-pointer pr-1 group">
      <div className="border-2 border-border rounded-full">
        <UserAvatar
          size="sm"
          userInitials={userInitials}
          color={color}
          showHeaderRing
          hoverable
          name={name}
          department={department}
        />
      </div>
      {name && (
        <span className="text-sm text-muted-foreground group-hover:text-hover-blue">
          {isCurrentUser ? `You (${name})` : name}
        </span>
      )}
    </div>
  );

  if (disableNavigation) {
    return content;
  }

  return <Link to={getStaffRoute(userId)}>{content}</Link>;
};
