import { Avatar, AvatarFallback } from '@react-monorepo/shared';

interface ProfileIconProps {
  // Props for customizing the avatar appearance
  size?: 'sm' | 'md';
  fallbackText?: string;
  className?: string;
}

// Component for displaying a user's profile avatar with customizable size and fallback
export const ProfileIcon = ({
  size = 'sm',
  fallbackText = 'U',
  className = '',
}: ProfileIconProps) => {
  // Map size prop to actual dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarFallback className="bg-blue-500 text-white">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};
