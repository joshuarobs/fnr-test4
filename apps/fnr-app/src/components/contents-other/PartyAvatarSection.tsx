import { Badge } from '@react-monorepo/shared';
import { ProfileIcon } from '../app-shell/ProfileIcon';

interface AvatarData {
  userInitials: string;
  color?: string;
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
      <div className="flex items-center gap-2 mb-2">
        <small className="text-sm font-medium">{title}</small>
        <Badge variant="secondary">{avatars.length}</Badge>
      </div>

      {/* Avatar section with multiple avatars */}
      <div className="flex gap-0.5">
        {avatars.map((avatar, index) => (
          <div key={index} className="border-2 border-background rounded-full">
            <ProfileIcon
              size="sm"
              userInitials={avatar.userInitials}
              color={avatar.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
