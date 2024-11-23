import {
  FaBed,
  FaKitchenSet,
  FaCouch,
  FaBath,
  FaWarehouse,
  FaCar,
} from 'react-icons/fa6';
import {
  MdMeetingRoom,
  MdOutdoorGrill,
  MdYard,
  MdLocalLaundryService,
  MdStorage,
  MdWork,
} from 'react-icons/md';
import { IconType } from 'react-icons';

export const NO_ROOM_CATEGORY_VALUE = '__none__';

export enum RoomCategory {
  MASTER_BEDROOM = 'MASTER_BEDROOM',
  BEDROOM_1 = 'BEDROOM_1',
  BEDROOM_2 = 'BEDROOM_2',
  KITCHEN_DINING = 'KITCHEN_DINING',
  LIVING_ROOM = 'LIVING_ROOM',
  BATHROOM = 'BATHROOM',
  LAUNDRY = 'LAUNDRY',
  OUTDOOR = 'OUTDOOR',
  GARDEN = 'GARDEN',
  GARAGE = 'GARAGE',
  STORAGE = 'STORAGE',
  BASEMENT = 'BASEMENT',
  OFFICE_STUDY = 'OFFICE_STUDY',
  OTHER = 'OTHER',
}

// Map room categories to their display names
export const roomCategoryDisplayNames: Record<RoomCategory, string> = {
  [RoomCategory.MASTER_BEDROOM]: 'Master Bedroom',
  [RoomCategory.BEDROOM_1]: 'Bedroom 1',
  [RoomCategory.BEDROOM_2]: 'Bedroom 2',
  [RoomCategory.KITCHEN_DINING]: 'Kitchen & Dining',
  [RoomCategory.LIVING_ROOM]: 'Living Room',
  [RoomCategory.BATHROOM]: 'Bathroom',
  [RoomCategory.LAUNDRY]: 'Laundry',
  [RoomCategory.OUTDOOR]: 'Outdoor',
  [RoomCategory.GARDEN]: 'Garden',
  [RoomCategory.GARAGE]: 'Garage',
  [RoomCategory.STORAGE]: 'Storage',
  [RoomCategory.BASEMENT]: 'Basement',
  [RoomCategory.OFFICE_STUDY]: 'Office/Study',
  [RoomCategory.OTHER]: 'Other',
};

// Map room categories to their icons
export const roomCategoryIcons: Record<RoomCategory, IconType> = {
  [RoomCategory.MASTER_BEDROOM]: FaBed,
  [RoomCategory.BEDROOM_1]: MdMeetingRoom,
  [RoomCategory.BEDROOM_2]: MdMeetingRoom,
  [RoomCategory.KITCHEN_DINING]: FaKitchenSet,
  [RoomCategory.LIVING_ROOM]: FaCouch,
  [RoomCategory.BATHROOM]: FaBath,
  [RoomCategory.LAUNDRY]: MdLocalLaundryService,
  [RoomCategory.OUTDOOR]: MdOutdoorGrill,
  [RoomCategory.GARDEN]: MdYard,
  [RoomCategory.GARAGE]: FaCar,
  [RoomCategory.STORAGE]: MdStorage,
  [RoomCategory.BASEMENT]: MdStorage,
  [RoomCategory.OFFICE_STUDY]: MdWork,
  [RoomCategory.OTHER]: FaWarehouse,
};
