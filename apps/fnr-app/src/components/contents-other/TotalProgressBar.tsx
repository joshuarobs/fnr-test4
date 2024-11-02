import { Progress } from '@react-monorepo/shared';

interface TotalProgressBarProps {
  title?: string;
  value: number;
  maxValue?: number;
}

export const TotalProgressBar = ({
  title = 'Total Progress',
  value,
  maxValue = 100,
}: TotalProgressBarProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="min-w-[200px]">
      <div className="mb-1">
        <span className="text-sm font-medium">{title}:</span>
        <span className="text-sm text-muted-foreground ml-2">
          {value}/{maxValue} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-[28px] flex items-center -mt-1">
        <Progress value={percentage} className="w-full" />
      </div>
    </div>
  );
};
