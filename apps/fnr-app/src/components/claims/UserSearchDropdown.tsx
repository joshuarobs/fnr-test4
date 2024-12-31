import { FilterableDropdown } from '../contents-table/shared/FilterableDropdown';
import { NavAvatar } from '../contents-other/NavAvatar';
import { useMemo } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
  avatarColour?: string;
}

interface UserSearchDropdownProps {
  showChevron?: boolean;
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  users: User[];
}

// Dropdown component for searching and selecting users in reassign claim popup
export const UserSearchDropdown = ({
  selectedUser,
  onUserSelect,
  onOpenChange,
  defaultOpen,
  className,
  showChevron,
  users,
}: UserSearchDropdownProps) => {
  // Create a mapping of user IDs to user objects for quick lookup
  const userMap = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users]
  );

  const renderTriggerContent = (userId: string | null) => {
    if (userId === null) {
      return (
        <div className="text-muted-foreground italic font-normal">
          Select user...
        </div>
      );
    }
    const user = userMap[userId];
    return (
      <NavAvatar
        userInitials={`${user.firstName[0]}${user.lastName[0]}`}
        name={`${user.firstName} ${user.lastName}`}
        userId={user.id}
        department={user.department}
        color={user.avatarColour}
      />
    );
  };

  const renderItemContent = (userId: string) => {
    const user = userMap[userId];
    return (
      <NavAvatar
        userInitials={`${user.firstName[0]}${user.lastName[0]}`}
        name={`${user.firstName} ${user.lastName}`}
        userId={user.id}
        department={user.department}
        color={user.avatarColour}
      />
    );
  };

  const renderNoValueContent = () => (
    <div className="flex items-center gap-2 text-muted-foreground italic font-normal">
      No user selected
    </div>
  );

  return (
    <FilterableDropdown
      selectedValue={selectedUser?.id || null}
      onValueSelect={(userId) => onUserSelect(userId ? userMap[userId] : null)}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      className={className}
      values={users.map((user) => user.id)}
      noValueOption="NO_USER"
      filterPlaceholder="Search users..."
      renderTriggerContent={renderTriggerContent}
      renderItemContent={renderItemContent}
      renderNoValueContent={renderNoValueContent}
      getFilterText={(userId) => {
        const user = userMap[userId];
        return `${user.firstName} ${user.lastName}`;
      }}
      showChevron={showChevron}
    />
  );
};
