/**
 * Utility functions for avatar-related operations
 */

/**
 * Gets initials from a company name, ignoring common words and symbols
 * @param company - The company name
 * @returns Two letter initials from first two significant words, or one letter if single word
 */
export const getCompanyInitials = (company?: string): string => {
  if (!company) return '??';

  // Remove common symbols
  const cleanedName = company.replace(/[&+]/g, ' ');

  // Common words to ignore
  const ignoreWords = [
    'of',
    'and',
    'the',
    'in',
    'on',
    'at',
    'by',
    'for',
    'to',
    'a',
    'an',
  ];

  // Split and filter words
  const words = cleanedName
    .trim()
    .split(' ')
    .filter(Boolean) // Remove empty strings
    .filter((word) => !ignoreWords.includes(word.toLowerCase())); // Remove common words

  if (words.length === 0) return '??';
  if (words.length === 1) return (words[0][0] || '').toUpperCase();
  return ((words[0][0] || '') + (words[1][0] || '')).toUpperCase();
};

/**
 * Gets initials from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two letter initials from first and last name
 */
export const getUserInitials = (
  firstName?: string,
  lastName?: string
): string => {
  if (!firstName || !lastName) return '??';
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};
