import React from 'react';

// Minimum number of characters required in the filter text before highlighting is applied
// Increase this value to reduce performance impact of highlighting on larger datasets
const MIN_CHARS_FOR_HIGHLIGHT = 3;

export const highlightText = (text: string, highlight: string) => {
  // Only highlight if the search term meets minimum length requirement
  if (!highlight.trim() || highlight.length < MIN_CHARS_FOR_HIGHLIGHT) {
    return text;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.toLowerCase() === highlight.toLowerCase()) {
      return (
        <span key={i} className="bg-purple-300">
          {part}
        </span>
      );
    }
    return part;
  });
};
