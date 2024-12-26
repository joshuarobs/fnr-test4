import { UserAvatar } from '../app-shell/UserAvatar';
import { Link } from 'react-router-dom';
import { getStaffRoute } from '../../routes';

interface NavAvatarProps {
  userInitials: string;
  color?: string;
  name?: string; // Made optional
  userId: string;
}

// Navigation avatar component with optional name label
export const NavAvatar = ({
  userInitials,
  color,
  name,
  userId,
}: NavAvatarProps) => {
  return (
    <Link
      to={getStaffRoute(userId)}
      className="w-fit flex items-center gap-2 cursor-pointer pr-1 group"
    >
      <div className="border-2 border-border rounded-full">
        <UserAvatar
          size="sm"
          userInitials={userInitials}
          color={color}
          showHeaderRing
          hoverable
          name={name}
        />
      </div>
      {name && (
        <span className="text-sm text-muted-foreground group-hover:text-hover-blue">
          {name}
        </span>
      )}
    </Link>
  );
};
