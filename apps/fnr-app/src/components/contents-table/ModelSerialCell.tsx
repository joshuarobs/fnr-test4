import React, { useState, useCallback } from 'react';

interface ModelSerialCellProps {
  modelSerialNumber: string;
}

export const ModelSerialCell: React.FC<ModelSerialCellProps> = ({
  modelSerialNumber,
}) => {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(modelSerialNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  }, [modelSerialNumber]);

  return (
    <div
      className="bg-gray-200 rounded p-2 font-mono cursor-pointer hover:bg-gray-300 transition-colors duration-200"
      onClick={handleClick}
    >
      <span className="text-sm text-gray-900">{modelSerialNumber}</span>
    </div>
  );
};
