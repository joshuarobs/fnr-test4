import React from 'react';

/**
 * A label component that displays "Archived" status with a red border and text
 */
export const ArchivedLabel = () => {
  return (
    <div className="px-3 py-1 border border-red-700 rounded">
      <span className="text-red-700 font-medium">Archived</span>
    </div>
  );
};
