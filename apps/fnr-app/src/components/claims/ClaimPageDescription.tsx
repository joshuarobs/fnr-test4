import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Textarea } from '@react-monorepo/shared';

interface ClaimPageDescriptionProps {
  description: string;
  onUpdate?: (newDescription: string) => void;
}

// Component to display and edit the claim description
export const ClaimPageDescription = ({
  description,
  onUpdate,
}: ClaimPageDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);

  // Handle double click to enter edit mode
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(description);
  };

  // Handle key press in textarea
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      if (onUpdate) {
        onUpdate(editValue);
      }
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Set cursor position to end of text
      textareaRef.current.setSelectionRange(editValue.length, editValue.length);
    }
  }, [isEditing, editValue]);

  if (isEditing) {
    return (
      <Textarea
        ref={textareaRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsEditing(false);
          if (onUpdate) {
            onUpdate(editValue);
          }
        }}
        className="w-[400px]"
      />
    );
  }

  return (
    <div
      className="text-sm text-muted-foreground min-h-[1.5rem] cursor-text w-[400px]"
      onDoubleClick={handleDoubleClick}
    >
      {description || 'No description provided'}
    </div>
  );
};
