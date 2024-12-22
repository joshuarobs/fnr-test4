import { Building2, MapPin } from 'lucide-react';
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
  location?: string;
  department?: string;

  // Appearance customization
  size?: 'sm' | 'md';
  color?: string;
  showHeaderRing?: boolean;

  // Behavior
  hoverable?: boolean;
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
  location = 'Australia',
  department = 'Claims',
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
        showHeaderRing ? 'ring-1 ring-gray-300 dark:ring-gray-600' : ''
      } ${hoverable ? 'hover:cursor-pointer' : ''}`}
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
    <HoverCard openDelay={500}>
      <HoverCardTrigger asChild>{AvatarComponent}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-2">
          {AvatarComponent}
          <div className="space-y-1 flex-1">
            <h4 className="text-base font-semibold">{name || userInitials}</h4>
            <div className="space-y-2 pt-2">
              <div className="flex items-center">
                <Building2 className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm text-muted-foreground">
                  {department}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-sm text-muted-foreground">
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
