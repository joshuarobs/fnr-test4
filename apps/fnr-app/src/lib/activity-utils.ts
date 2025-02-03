import { ActivityType } from '../store/services/api';

interface ActivityMetadata {
  // Common fields
  claimNumber?: string;
  itemName?: string;
  details?: string;

  // Item-specific fields
  category?: string;
  roomCategory?: string;
  group?: string;
  modelSerialNumber?: string;
  description?: string;
  quantity?: number;
  purchaseDate?: string;
  age?: number;
  condition?: string;
  insuredsQuote?: number;
  ourQuote?: number;
  itemStatus?: string;

  // For item updates
  changes?: {
    name?: string;
    category?: string;
    roomCategory?: string;
    group?: string;
    modelSerialNumber?: string;
    description?: string;
    quantity?: number;
    purchaseDate?: string;
    age?: number;
    condition?: string;
    insuredsQuote?: number;
    ourQuote?: number;
    itemStatus?: string;
  };

  [key: string]: any; // Allow additional fields
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
  const { claimNumber, details } = metadata;
  // DO NOT destructure itemName - we want to always use metadata.itemName directly

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
      const itemDetails = [];
      // For ITEM_CREATED, use the original name from metadata
      if (metadata.itemName) itemDetails.push(metadata.itemName);
      if (metadata.insuredsQuote)
        itemDetails.push(`Insured's Quote: $${metadata.insuredsQuote}`);
      if (metadata.ourQuote)
        itemDetails.push(`Our Quote: $${metadata.ourQuote}`);
      return `Added new item "${itemDetails.join(' - ')}"`;

    case ActivityType.ITEM_UPDATED:
      const changes = [];
      if (metadata.changes) {
        if (metadata.changes.name) changes.push('name');
        if (metadata.changes.insuredsQuote) changes.push("insured's quote");
        if (metadata.changes.ourQuote) changes.push('our quote');
        if (metadata.changes.itemStatus) changes.push('status');
        if (metadata.changes.category) changes.push('category');
        if (metadata.changes.roomCategory) changes.push('room');
        if (metadata.changes.quantity) changes.push('quantity');
      }
      // metadata.itemName is now the NEW name after the update
      // metadata.changes contains the update data that was applied
      return `Updated ${changes.join(', ')} for item "${metadata.itemName}"`;

    case ActivityType.ITEM_DELETED:
      // For deletion, use the name at time of deletion from metadata
      return `Deleted item "${metadata.itemName}"`;

    case ActivityType.ITEM_STATUS_CHANGED:
      // For status changes, use the name at time of status change from metadata
      return `Changed status of item "${metadata.itemName}"`;

    case ActivityType.ITEM_EVIDENCE_ADDED:
      // For evidence operations, use the name at time of evidence addition from metadata
      return `Added evidence to "${metadata.itemName}"`;

    case ActivityType.ITEM_EVIDENCE_REMOVED:
      // For evidence operations, use the name at time of evidence removal from metadata
      return `Removed evidence from "${metadata.itemName}"`;

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
