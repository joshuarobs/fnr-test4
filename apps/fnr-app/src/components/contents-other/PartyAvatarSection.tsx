import { Badge } from '@react-monorepo/shared';
import { UserAvatar } from '../app-shell/UserAvatar';

interface AvatarData {
  userInitials: string;
  color?: string;
  name: string; // Name field for displaying next to avatar (mandatory)
}

interface PartyAvatarSectionProps {
  // Title for the section (mandatory)
  title: string;
  // Array of avatar data
  avatars: AvatarData[];
}

export const PartyAvatarSection = ({
  title,
  avatars,
}: PartyAvatarSectionProps) => {
  return (
    <div>
      {/* Title row with badge showing number of avatars */}
      <div className="inline-flex items-center gap-2 mb-2 cursor-pointer hover:text-blue-600">
        <span className="text-base font-medium">{title}</span>
        <Badge variant="secondary">{avatars.length}</Badge>
      </div>

      {/* Avatar section - vertical for 2 or less, horizontal for more */}
      {avatars.length <= 2 ? (
        // Vertical layout with names for 2 or fewer avatars
        <div className="flex flex-col gap-1">
          {avatars.map((avatar, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="border-2 border-background rounded-full">
                <UserAvatar
                  size="sm"
                  userInitials={avatar.userInitials}
                  color={avatar.color}
                  showHeaderRing
                />
              </div>
              {/* Display name if available, otherwise show initials */}
              <span className="text-sm text-muted-foreground">
                {avatar.name || avatar.userInitials}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // Horizontal layout for more than 2 avatars
        <div className="flex gap-0.5">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className="border-2 border-background rounded-full"
            >
              <UserAvatar
                size="sm"
                userInitials={avatar.userInitials}
                color={avatar.color}
                showHeaderRing
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
