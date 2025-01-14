import React, { useState, KeyboardEvent } from 'react';

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

  if (isEditing) {
    return (
      <textarea
        className="min-w-[400px] w-full p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setIsEditing(false);
          if (onUpdate) {
            onUpdate(editValue);
          }
        }}
        autoFocus
      />
    );
  }

  return (
    <div
      className="text-sm text-muted-foreground min-h-[1.5rem] cursor-text min-w-[400px]"
      onDoubleClick={handleDoubleClick}
    >
      {description || 'No description provided'}
    </div>
  );
};
