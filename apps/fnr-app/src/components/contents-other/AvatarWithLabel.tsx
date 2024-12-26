import { UserAvatar } from '../app-shell/UserAvatar';
import { Link } from 'react-router-dom';
import { getUserRoute } from '../../routes';

interface AvatarWithLabelProps {
  userInitials: string;
  color?: string;
  name: string;
  userId: string;
}

export const AvatarWithLabel = ({
  userInitials,
  color,
  name,
  userId,
}: AvatarWithLabelProps) => {
  return (
    <Link
      to={getUserRoute(userId)}
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
      <span className="text-sm text-muted-foreground group-hover:text-hover-blue">
        {name || userInitials}
      </span>
    </Link>
  );
};
