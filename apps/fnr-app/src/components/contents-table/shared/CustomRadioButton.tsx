import { DotFilledIcon } from '@radix-ui/react-icons';

interface CustomRadioButtonProps {
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  label: React.ReactNode;
  className?: string;
}

export const CustomRadioButton = ({
  value,
  selectedValue,
  onChange,
  label,
  className,
}: CustomRadioButtonProps) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer rounded-md px-4 py-1.5 hover:bg-muted/50 transition-colors ${
        selectedValue === value ? 'bg-muted' : ''
      } ${className || ''}`}
      onClick={(e) => {
        e.preventDefault();
        onChange(value);
      }}
    >
      <div className="aspect-square h-4 w-4 rounded-full border border-primary text-primary">
        {selectedValue === value && (
          <DotFilledIcon className="h-3.5 w-3.5 fill-primary" />
        )}
      </div>
      {label}
    </div>
  );
};
