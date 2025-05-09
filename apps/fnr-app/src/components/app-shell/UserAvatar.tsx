import { Building2, MapPin, UserRound } from 'lucide-react';
import fontColorContrast from 'font-color-contrast';
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
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  showHeaderRing?: boolean;
  isEmptyUser?: boolean;

  // Behavior
  hoverable?: boolean;
}

// Component that combines ProfileIcon and AvatarHoverCard functionality
export const UserAvatar = ({
  name,
  imageUrl,
  userInitials = 'JD',
  size = 'sm',
  color = '#6B7280', // Default gray-500 hex color
  showHeaderRing = false,
  hoverable = true,
  location = 'Australia',
  department = 'Claims',
  isEmptyUser = false,
}: UserAvatarProps) => {
  // Map size prop to actual dimensions and text sizes
  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  };

  // Create avatar component with configurable size
  const createAvatarComponent = (avatarSize: 'xs' | 'sm' | 'md' | 'lg') => (
    <Avatar
      className={`${sizeClasses[avatarSize]} 
      ${showHeaderRing ? 'ring-1 ring-gray-300 dark:ring-gray-600' : ''} ${
        hoverable ? 'hover:cursor-pointer' : ''
      } ${
        isEmptyUser
          ? 'border border-dashed border-gray-300 dark:border-gray-600 bg-transparent'
          : ''
      }`}
    >
      {isEmptyUser ? (
        <AvatarFallback className="bg-transparent">
          <UserRound className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </AvatarFallback>
      ) : imageUrl ? (
        <AvatarImage src={imageUrl} alt={name || userInitials} />
      ) : (
        <AvatarFallback
          className="dark:brightness-[0.9] font-medium select-none"
          style={{ backgroundColor: color, color: fontColorContrast(color) }}
        >
          {userInitials}
        </AvatarFallback>
      )}
    </Avatar>
  );

  // Create base avatar with given size
  const baseAvatarComponent = createAvatarComponent(size);

  // If hoverable is false, just return the base avatar component
  if (!hoverable) {
    return baseAvatarComponent;
  }

  // If hoverable is true, wrap the avatar in a HoverCard with medium-sized popup avatar
  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger asChild>{baseAvatarComponent}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-2">
          {createAvatarComponent('md')}
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
