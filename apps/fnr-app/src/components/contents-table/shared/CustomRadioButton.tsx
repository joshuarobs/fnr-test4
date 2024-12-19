import { DotFilledIcon } from '@radix-ui/react-icons';

interface CustomRadioButtonProps {
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  label: React.ReactNode;
  className?: string;
  disableHover?: boolean;
}

export const CustomRadioButton = ({
  value,
  selectedValue,
  onChange,
  label,
  className,
  disableHover = false,
}: CustomRadioButtonProps) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer rounded-md px-4 py-1.5 ${
        !disableHover && 'hover:bg-muted/50'
      } transition-colors ${selectedValue === value ? 'bg-muted' : ''} ${
        className || ''
      }`}
      onClick={(e) => {
        e.preventDefault();
        onChange(value);
      }}
    >
      <div
        className={`aspect-square h-4 w-4 rounded-full border flex items-center justify-center ${
          selectedValue === value ? 'border-blue-700' : 'border-primary'
        }`}
      >
        {selectedValue === value && (
          <DotFilledIcon className="h-[14px] w-[14px] text-blue-700 scale-150" />
        )}
      </div>
      {label}
    </div>
  );
};
