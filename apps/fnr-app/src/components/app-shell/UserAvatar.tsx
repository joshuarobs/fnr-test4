import { CalendarDays } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@react-monorepo/shared';

interface UserAvatarProps {
  // Core user info
  name?: string;
  imageUrl?: string;
  userInitials?: string;

  // Appearance customization
  size?: 'sm' | 'md';
  color?: string;
  showHeaderRing?: boolean;

  // Behavior
  hoverable?: boolean;
  joinDate?: string; // Optional join date for hover card
}

// Component that combines ProfileIcon and AvatarHoverCard functionality
export const UserAvatar = ({
  name,
  imageUrl,
  userInitials = 'JD',
  size = 'sm',
  color = 'bg-gray-500',
  showHeaderRing = false,
  hoverable = false,
  joinDate,
}: UserAvatarProps) => {
  // Map size prop to actual dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
  };

  // Base avatar component that's used in both hoverable and non-hoverable modes
  const AvatarComponent = (
    <Avatar
      className={`${sizeClasses[size]} ${
        showHeaderRing ? 'ring-1 ring-gray-300' : ''
      }`}
    >
      {imageUrl ? (
        <AvatarImage src={imageUrl} alt={name || userInitials} />
      ) : (
        <AvatarFallback className={`${color} text-white`}>
          {userInitials}
        </AvatarFallback>
      )}
    </Avatar>
  );

  // If hoverable is false, just return the avatar component
  if (!hoverable) {
    return AvatarComponent;
  }

  // If hoverable is true, wrap the avatar in a HoverCard
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{AvatarComponent}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-2">
          {/* This avatar in the hover card is intentionally not hoverable */}
          <Avatar>
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name || userInitials} />
            ) : (
              <AvatarFallback className={color}>{userInitials}</AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{name || userInitials}</h4>
            {joinDate && (
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Joined {joinDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
