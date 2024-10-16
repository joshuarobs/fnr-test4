import React, { useState, useCallback } from 'react';
import { ExternalLinkIcon, CheckIcon } from '@radix-ui/react-icons';

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
      className="flex flex-row items-center justify-between bg-gray-200 rounded p-2 font-mono cursor-pointer hover:bg-gray-300 transition-colors duration-200"
      onClick={handleClick}
    >
      <span className="text-sm text-gray-900">{modelSerialNumber}</span>
      {copied ? (
        <CheckIcon className="ml-4 w-5 h-5 text-green-500" />
      ) : (
        <ExternalLinkIcon className="ml-4 w-5 h-5 stroke-4" />
      )}
    </div>
  );
};
