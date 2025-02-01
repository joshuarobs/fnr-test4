import { ActivityType } from '../store/services/api';

interface ActivityMetadata {
  claimNumber?: string;
  itemName?: string;
  details?: string;
  [key: string]: any;
}

/**
 * Formats activity text based on activity type and context
 * @param activityType The type of activity
 * @param metadata Activity metadata containing claimNumber, itemName, etc.
 * @param currentClaimNumber Optional current claim number for contextual messages
 * @returns Formatted activity text
 */
export const getActivityText = (
  activityType: ActivityType,
  metadata: ActivityMetadata,
  currentClaimNumber?: string
): string => {
  const { claimNumber, itemName, details } = metadata;

  // Ensure activityType is a valid enum value
  const normalizedType = activityType?.toUpperCase?.() || activityType;

  switch (normalizedType) {
    // Claim activities
    case ActivityType.CLAIM_CREATED:
      if (claimNumber === currentClaimNumber) {
        return 'Created this claim';
      }
      return `Created claim ${claimNumber}`;

    case ActivityType.CLAIM_UPDATED:
      if (claimNumber === currentClaimNumber) {
        return 'Updated this claim';
      }
      return `Updated claim ${claimNumber}`;

    case ActivityType.CLAIM_DELETED:
      if (claimNumber === currentClaimNumber) {
        return 'Deleted this claim';
      }
      return `Deleted claim ${claimNumber}`;

    case ActivityType.CLAIM_STATUS_CHANGED:
      if (claimNumber === currentClaimNumber) {
        return 'Changed status of this claim';
      }
      return `Changed status of claim ${claimNumber}`;

    case ActivityType.CLAIM_HANDLER_ASSIGNED:
      if (claimNumber === currentClaimNumber) {
        return details
          ? `Assigned ${details} to this claim`
          : 'Assigned handler to this claim';
      }
      return details
        ? `Assigned ${details} to claim ${claimNumber}`
        : `Assigned handler to claim ${claimNumber}`;

    // Item activities
    case ActivityType.ITEM_CREATED:
      return `Added new item "${itemName}"`;

    case ActivityType.ITEM_UPDATED:
      return `Updated item "${itemName}"`;

    case ActivityType.ITEM_DELETED:
      return `Deleted item "${itemName}"`;

    case ActivityType.ITEM_STATUS_CHANGED:
      return `Changed status of item "${itemName}"`;

    case ActivityType.ITEM_EVIDENCE_ADDED:
      return `Added evidence to "${itemName}"`;

    case ActivityType.ITEM_EVIDENCE_REMOVED:
      return `Removed evidence from "${itemName}"`;

    default:
      // More detailed logging to help debug activity type issues
      console.warn(
        `Unhandled activity type: ${activityType}`,
        `Normalized type: ${normalizedType}`,
        `Valid types:`,
        Object.values(ActivityType)
      );
      return `Unknown activity (${activityType})`;
  }
};
