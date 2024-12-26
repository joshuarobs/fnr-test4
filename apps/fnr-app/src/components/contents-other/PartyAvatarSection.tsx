import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@react-monorepo/shared';
import { AvatarWithLabel } from './AvatarWithLabel';
import { UserAvatar } from '../app-shell/UserAvatar';

interface AvatarData {
  userInitials: string;
  color?: string;
  name: string; // Name field for displaying next to avatar (mandatory)
  userId: string; // User ID for navigation
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
      <Dialog>
        <DialogTrigger asChild>
          <div className="inline-flex items-center gap-2 mb-2 cursor-pointer hover:text-hover-blue">
            <span className="text-base font-medium">{title}</span>
            <Badge variant="secondary">{avatars.length}</Badge>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {title}
              <Badge variant="secondary">{avatars.length}</Badge>
            </DialogTitle>
          </DialogHeader>
          {/* Show all avatars in vertical layout with full details */}
          <ScrollArea className="h-[160px] mt-4">
            <div className="flex flex-col gap-2 pr-4">
              {avatars.map((avatar, index) => (
                <AvatarWithLabel
                  key={index}
                  userInitials={avatar.userInitials}
                  color={avatar.color}
                  name={avatar.name}
                  userId={avatar.userId}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Avatar section - vertical for 2 or less, horizontal for more */}
      {avatars.length <= 2 ? (
        // Vertical layout with names for 2 or fewer avatars
        <div className="flex flex-col gap-1">
          {avatars.map((avatar, index) => (
            <AvatarWithLabel
              key={index}
              userInitials={avatar.userInitials}
              color={avatar.color}
              name={avatar.name}
              userId={avatar.userId}
            />
          ))}
        </div>
      ) : (
        // Horizontal layout for more than 2 avatars
        <div className="flex gap-0.5">
          {avatars.map((avatar, index) => (
            <div key={index} className="border-2 border-border rounded-full">
              <UserAvatar
                size="sm"
                userInitials={avatar.userInitials}
                color={avatar.color}
                showHeaderRing
                hoverable
                name={avatar.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
