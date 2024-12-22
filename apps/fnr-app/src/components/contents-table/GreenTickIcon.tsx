import { CheckIcon } from '@radix-ui/react-icons';

// Component that displays a green tick icon with size options
// size: 'medium' (default) - standard size tick
//       'small' - smaller tick with reduced scale and dimensions
type GreenTickIconProps = {
  size?: 'small' | 'medium';
};

export const GreenTickIcon = ({ size = 'medium' }: GreenTickIconProps) => {
  const isSmall = size === 'small';

  return (
    <div
      className={`inline-flex items-center justify-center ${
        isSmall ? 'w-4 h-4' : 'w-5 h-5'
      } bg-green-500 dark:bg-green-600 rounded-full ml-2`}
    >
      <CheckIcon
        className={`text-white transform ${
          isSmall ? 'scale-100' : 'scale-125'
        }`}
      />
    </div>
  );
};
