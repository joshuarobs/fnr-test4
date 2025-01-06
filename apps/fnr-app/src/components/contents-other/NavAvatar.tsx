import { UserAvatar } from '../app-shell/UserAvatar';
import { Link } from 'react-router-dom';
import { getStaffRoute } from '../../routes';
import { useUser } from '../providers/UserContext';

interface NavAvatarProps {
  userInitials?: string;
  color?: string;
  name?: string;
  userId?: string;
  department?: string;
  disableNavigation?: boolean; // Add prop to control navigation behavior
  showHeaderRing?: boolean; // Controls header ring visibility
  overrideClickFunc?: () => void; // Optional click handler function
  disableHover?: boolean; // Controls whether text changes color on hover
}

// Navigation avatar component with optional name label
export const NavAvatar = ({
  userInitials,
  color,
  name,
  userId,
  department,
  disableNavigation,
  showHeaderRing,
  overrideClickFunc,
  disableHover,
}: NavAvatarProps) => {
  const currentUser = useUser();
  const isCurrentUser = userId ? userId === currentUser.employeeId : false;
  const isEmptyUser = !userId;

  const content = (
    <div
      onClick={overrideClickFunc}
      className={`w-fit flex items-center gap-2 cursor-pointer pr-1 group ${
        isEmptyUser && overrideClickFunc
          ? 'border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-1 pr-2'
          : ''
      }`}
    >
      <div className="rounded-full p-0.5">
        <UserAvatar
          size="sm"
          userInitials={userInitials || ''}
          color={color}
          name={name}
          department={department}
          isEmptyUser={isEmptyUser}
          showHeaderRing={showHeaderRing || !isEmptyUser}
        />
      </div>
      {(name || isEmptyUser) && (
        <span
          className={`text-sm text-muted-foreground ${
            !disableHover && 'group-hover:text-hover-blue'
          }`}
        >
          {isEmptyUser
            ? 'No user assigned'
            : isCurrentUser
            ? `You (${name})`
            : name}
        </span>
      )}
    </div>
  );

  if (disableNavigation || isEmptyUser) {
    return content;
  }

  return userId ? (
    <Link
      className="focus:outline-none focus-visible:ring-0"
      to={getStaffRoute(userId)}
    >
      {content}
    </Link>
  ) : (
    content
  );
};
