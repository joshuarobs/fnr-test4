/**
 * Utility functions for avatar-related operations
 */

/**
 * Gets initials from a company name
 * @param company - The company name
 * @returns Two letter initials from first two words, or one letter if single word
 */
export const getCompanyInitials = (company?: string): string => {
  if (!company) return '??';
  const words = company.trim().split(' ').filter(Boolean);
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
