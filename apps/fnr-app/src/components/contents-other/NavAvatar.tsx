import { UserAvatar } from '../app-shell/UserAvatar';
import { Link } from 'react-router-dom';
import { getStaffRoute, getSupplierRoute } from '../../routes';
import { useUser } from '../providers/UserContext';
import { getCompanyInitials } from '../../lib/avatar-utils';

interface NavAvatarProps {
  userInitials?: string;
  color?: string;
  name?: string;
  userId?: number;
  employeeId?: string;
  supplierId?: string;
  department?: string;
  disableNavigation?: boolean; // Add prop to control navigation behavior
  showHeaderRing?: boolean; // Controls header ring visibility
  overrideClickFunc?: () => void; // Optional click handler function
  disableHoverText?: boolean; // Controls whether text changes color on hover
  companyName?: string; // Optional company name to generate initials from
  disableHoverCard?: boolean; // Controls whether the hover card is shown
  isSupplier?: boolean; // Flag to determine if the user is a supplier
  hideTextLabel?: boolean; // Controls whether the name label is shown
  mini?: boolean; // Controls whether to use mini style (smaller avatar and text)
}

// Navigation avatar component with optional name label
export const NavAvatar = ({
  userInitials,
  color,
  name,
  userId,
  employeeId,
  supplierId,
  department,
  disableNavigation,
  showHeaderRing,
  overrideClickFunc,
  disableHoverText,
  companyName: company,
  disableHoverCard,
  isSupplier,
  hideTextLabel,
  mini,
}: NavAvatarProps) => {
  const currentUser = useUser();
  const isCurrentUser = userId ? userId === currentUser?.id : false;
  const isEmptyUser = !userId;

  // Truncate name if mini style and name is too long
  const displayName =
    mini && name && name.length > 20 ? `${name.slice(0, 20)}...` : name;

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
          size={mini ? 'xs' : 'sm'}
          userInitials={
            company ? getCompanyInitials(company) : userInitials || ''
          }
          color={color}
          name={name}
          department={department}
          isEmptyUser={isEmptyUser}
          showHeaderRing={showHeaderRing || !isEmptyUser}
          hoverable={!disableHoverCard}
        />
      </div>
      {!hideTextLabel && (name || isEmptyUser) && (
        <span
          className={`${mini ? 'text-sm font-medium' : 'text-sm'} ${
            isEmptyUser ? 'text-muted-foreground' : ''
          } ${!disableHoverText ? 'group-hover:text-hover-blue' : ''}`}
        >
          {isEmptyUser
            ? 'No user assigned'
            : isCurrentUser
            ? `You (${displayName})`
            : displayName}
        </span>
      )}
    </div>
  );

  if (disableNavigation || isEmptyUser) {
    return content;
  }

  if (!userId) {
    return content;
  }

  let route = '';
  if (isSupplier) {
    route = getSupplierRoute(supplierId || '');
  } else if (
    (currentUser.role === 'STAFF' || currentUser.role === 'ADMIN') &&
    employeeId
  ) {
    route = getStaffRoute(employeeId);
  }

  return route ? (
    <Link className="focus:outline-none focus-visible:ring-0" to={route}>
      {content}
    </Link>
  ) : (
    content
  );
};
