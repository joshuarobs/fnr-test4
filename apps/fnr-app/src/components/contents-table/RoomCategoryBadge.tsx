import { RoomCategory, roomCategoryDisplayNames } from './roomCategories';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@react-monorepo/shared';

// Define the common interface for room category details
export interface RoomCategoryDetails {
  bgClass: string;
  textClass: string;
  text: string;
}

// Define the function to get room category details
export const getRoomCategoryDetails = (
  roomCategory: RoomCategory
): RoomCategoryDetails => {
  switch (roomCategory) {
    case RoomCategory.MASTER_BEDROOM:
      return {
        bgClass: 'bg-blue-200 dark:bg-blue-900',
        textClass: 'text-blue-800 dark:text-blue-100',
        text: roomCategoryDisplayNames[RoomCategory.MASTER_BEDROOM],
      };
    case RoomCategory.BEDROOM_1:
      return {
        bgClass: 'bg-pink-200 dark:bg-pink-900',
        textClass: 'text-pink-800 dark:text-pink-100',
        text: roomCategoryDisplayNames[RoomCategory.BEDROOM_1],
      };
    case RoomCategory.BEDROOM_2:
      return {
        bgClass: 'bg-violet-200 dark:bg-violet-900',
        textClass: 'text-violet-800 dark:text-violet-100',
        text: roomCategoryDisplayNames[RoomCategory.BEDROOM_2],
      };
    case RoomCategory.KITCHEN_DINING:
      return {
        bgClass: 'bg-amber-200 dark:bg-amber-900',
        textClass: 'text-amber-800 dark:text-amber-100',
        text: roomCategoryDisplayNames[RoomCategory.KITCHEN_DINING],
      };
    case RoomCategory.LIVING_ROOM:
      return {
        bgClass: 'bg-emerald-200 dark:bg-emerald-900',
        textClass: 'text-emerald-800 dark:text-emerald-100',
        text: roomCategoryDisplayNames[RoomCategory.LIVING_ROOM],
      };
    case RoomCategory.BATHROOM:
      return {
        bgClass: 'bg-cyan-200 dark:bg-cyan-900',
        textClass: 'text-cyan-800 dark:text-cyan-100',
        text: roomCategoryDisplayNames[RoomCategory.BATHROOM],
      };
    case RoomCategory.LAUNDRY:
      return {
        bgClass: 'bg-yellow-200 dark:bg-yellow-900',
        textClass: 'text-yellow-800 dark:text-yellow-100',
        text: roomCategoryDisplayNames[RoomCategory.LAUNDRY],
      };
    case RoomCategory.OUTDOOR:
      return {
        bgClass: 'bg-lime-200 dark:bg-lime-900',
        textClass: 'text-lime-800 dark:text-lime-100',
        text: roomCategoryDisplayNames[RoomCategory.OUTDOOR],
      };
    case RoomCategory.GARDEN:
      return {
        bgClass: 'bg-green-200 dark:bg-green-900',
        textClass: 'text-green-800 dark:text-green-100',
        text: roomCategoryDisplayNames[RoomCategory.GARDEN],
      };
    case RoomCategory.GARAGE:
      return {
        bgClass: 'bg-zinc-200 dark:bg-zinc-800',
        textClass: 'text-zinc-800 dark:text-zinc-100',
        text: roomCategoryDisplayNames[RoomCategory.GARAGE],
      };
    case RoomCategory.STORAGE:
      return {
        bgClass: 'bg-[#E7D6C4] dark:bg-[#4A301D]',
        textClass: 'text-[#4A301D] dark:text-[#E7D6C4]',
        text: roomCategoryDisplayNames[RoomCategory.STORAGE],
      };
    case RoomCategory.BASEMENT:
      return {
        bgClass: 'bg-slate-300 dark:bg-slate-800',
        textClass: 'text-slate-800 dark:text-slate-100',
        text: roomCategoryDisplayNames[RoomCategory.BASEMENT],
      };
    case RoomCategory.OFFICE_STUDY:
      return {
        bgClass: 'bg-indigo-200 dark:bg-indigo-900',
        textClass: 'text-indigo-800 dark:text-indigo-100',
        text: roomCategoryDisplayNames[RoomCategory.OFFICE_STUDY],
      };
    case RoomCategory.OTHER:
      return {
        bgClass: 'bg-gray-200 dark:bg-gray-800',
        textClass: 'text-gray-800 dark:text-gray-100',
        text: roomCategoryDisplayNames[RoomCategory.OTHER],
      };
    default:
      return {
        bgClass: 'bg-gray-200 dark:bg-gray-800',
        textClass: 'text-gray-600 dark:text-gray-300',
        text: 'Unknown',
      };
  }
};

type RoomCategoryBadgeProps = {
  roomCategory: RoomCategory;
  showTooltip?: boolean;
};

// Component to display room category as a badge
export const RoomCategoryBadge = ({
  roomCategory,
  showTooltip = true,
}: RoomCategoryBadgeProps) => {
  const categoryDetails: RoomCategoryDetails =
    getRoomCategoryDetails(roomCategory);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${categoryDetails.bgClass} ${categoryDetails.textClass}`}
          >
            {categoryDetails.text}
          </span>
        </TooltipTrigger>
        {showTooltip && (
          <TooltipContent>
            <p>{categoryDetails.text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
