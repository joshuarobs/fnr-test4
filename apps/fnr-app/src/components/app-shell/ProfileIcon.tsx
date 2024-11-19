import { Avatar, AvatarFallback } from '@react-monorepo/shared';

interface ProfileIconProps {
  // Props for customizing the avatar appearance
  size?: 'sm' | 'md';
  userInitials?: string;
  color?: string;
}

// Component for displaying a user's profile avatar with customizable size and fallback
export const ProfileIcon = ({
  size = 'sm',
  userInitials = 'JD',
  color = 'bg-gray-500',
}: ProfileIconProps) => {
  // Map size prop to actual dimensions
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
  };

  return (
    <Avatar className={`${sizeClasses[size]}`}>
      <AvatarFallback className={`${color} text-white`}>
        {userInitials}
      </AvatarFallback>
    </Avatar>
  );
};
