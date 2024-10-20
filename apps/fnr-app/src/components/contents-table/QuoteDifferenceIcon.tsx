import { GreenTickIcon } from './GreenTickIcon';
import { TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons';

interface QuoteDifferenceIconProps {
  oisquote: number;
  ourquote: number;
}

export const QuoteDifferenceIcon = ({
  oisquote,
  ourquote,
}: QuoteDifferenceIconProps) => {
  const diff = oisquote - ourquote;

  if (diff === 0) {
    return <GreenTickIcon />;
  } else if (diff > 0) {
    return (
      <div className="flex items-center">
        <TriangleUpIcon className="text-red-700 mr-1" />
        <span className="text-red-500 font-semibold">(${diff.toFixed(2)})</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center">
        <TriangleDownIcon className="text-green-600 mr-1" />
        <span className="text-green-600 font-semibold">
          (${Math.abs(diff).toFixed(2)})
        </span>
      </div>
    );
  }
};
