import { GreenTickIcon } from './GreenTickIcon';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

interface QuoteDifferenceIconProps {
  insuredsQuote: number;
  ourQuote: number; // Fixed casing to match database schema
}

export const QuoteDifferenceIcon = ({
  insuredsQuote,
  ourQuote, // Fixed casing to match database schema
}: QuoteDifferenceIconProps) => {
  const diff = insuredsQuote - ourQuote;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const iconStyle = {
    display: 'inline-flex',
    verticalAlign: 'middle',
    position: 'relative' as const,
  };

  const tooltipText =
    diff > 0
      ? `The insured's quote is higher than our quote by ${formatter.format(
          Math.abs(diff)
        )}`
      : `The insured's quote is lower than our quote by ${formatter.format(
          Math.abs(diff)
        )}`;

  if (diff === 0) {
    return <GreenTickIcon />;
  } else if (diff > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center">
              <CaretUpOutlined
                className="text-status-error dark:text-red-400 mr-1"
                style={iconStyle}
              />
              <span className="text-status-error dark:text-red-400 font-semibold">
                {formatter.format(diff)}
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
                className="text-status-success dark:text-green-400 mr-1"
                style={{ ...iconStyle, top: '2px' }}
              />
              <span className="text-status-success dark:text-green-400 font-semibold">
                {formatter.format(Math.abs(diff))}
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
