import { UserAvatar } from '../app-shell/UserAvatar';

interface AvatarWithLabelProps {
  userInitials: string;
  color?: string;
  name: string;
}

export const AvatarWithLabel = ({
  userInitials,
  color,
  name,
}: AvatarWithLabelProps) => {
  return (
    <div className="w-fit flex items-center gap-2 cursor-pointer pr-1 group">
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
    </div>
  );
};
