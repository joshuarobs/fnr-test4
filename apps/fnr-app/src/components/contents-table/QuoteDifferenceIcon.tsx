import { GreenTickIcon } from './GreenTickIcon';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { TriangleUpIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface QuoteDifferenceIconProps {
  oisquote: number;
  ourquote: number;
}

export const QuoteDifferenceIcon = ({
  oisquote,
  ourquote,
}: QuoteDifferenceIconProps) => {
  const diff = oisquote - ourquote;

  // Define color variables
  const redColor = 'text-red-500';
  const greenColor = 'text-green-600';

  const iconStyle = {
    display: 'inline-flex',
    verticalAlign: 'middle',
    position: 'relative' as const,
  };

  const tooltipText =
    diff > 0
      ? `The insured's quote is higher than our quote by $${Math.abs(
          diff
        ).toFixed(2)}`
      : `The insured's quote is lower than our quote by $${Math.abs(
          diff
        ).toFixed(2)}`;

  if (diff === 0) {
    return <GreenTickIcon />;
  } else if (diff > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <CaretUpOutlined
                className={`${redColor} mr-1`}
                style={iconStyle}
              />
              <span className={`${redColor} font-semibold`}>
                ${diff.toFixed(2)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <CaretDownOutlined
                className={`${greenColor} mr-1`}
                style={{ ...iconStyle, top: '2px' }}
              />
              <span className={`${greenColor} font-semibold`}>
                ${Math.abs(diff).toFixed(2)}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
};
