import React, { useState, useCallback } from 'react';
import { Input } from '@react-monorepo/shared';
import { PencilIcon } from 'lucide-react';

interface EditableInputFieldProps {
  initialValue: string;
  onSave: (value: string) => void;
  formatDisplay: (value: string) => React.ReactNode;
  validate?: (value: string) => boolean;
  inputClassName?: string;
  iconPosition: 'left' | 'right';
  textAlign?: 'left' | 'center' | 'right';
  isEditable?: boolean; // New prop
}

export const EditableInputField = ({
  initialValue,
  onSave,
  formatDisplay,
  validate = () => true,
  inputClassName = '',
  iconPosition = 'left',
  textAlign = 'left',
  isEditable = true, // Default to true
}: EditableInputFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = useCallback(() => {
    if (isEditable) {
      setIsEditing(true);
      setIsHovering(false);
    }
  }, [isEditable]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (validate(newValue)) {
        setValue(newValue);
      }
    },
    [validate]
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onSave(value);
  }, [value, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    },
    [handleBlur]
  );

  const iconElement = (
    <div className="w-4">
      {isHovering && isEditable ? (
        <PencilIcon size={16} className="text-gray-500" />
      ) : (
        <div className="w-4 h-4" />
      )}
    </div>
  );

  return (
    <>
      {isEditing ? (
        <div className="flex justify-end mr-2">
          <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className={`px-2 py-1 text-${textAlign} ${inputClassName}`}
          />
        </div>
      ) : (
        <div
          className={`flex items-center mr-2 p-2 rounded ${
            isEditable ? 'cursor-pointer' : ''
          } ${isHovering && isEditable ? 'bg-black bg-opacity-10' : ''}`}
          onMouseEnter={() => isEditable && setIsHovering(true)}
          onMouseLeave={() => isEditable && setIsHovering(false)}
          onDoubleClick={handleDoubleClick}
        >
          {iconPosition === 'left' && <div className="mr-1">{iconElement}</div>}
          <div className={`text-${textAlign} flex-grow`}>
            {formatDisplay(value)}
          </div>
          {iconPosition === 'right' && (
            <div className="ml-1">{iconElement}</div>
          )}
        </div>
      )}
    </>
  );
};
