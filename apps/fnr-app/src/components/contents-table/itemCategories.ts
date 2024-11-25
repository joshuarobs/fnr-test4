import {
  FaHome,
  FaCar,
  FaBath,
  FaTshirt,
  FaPaintBrush,
  FaLaptop,
  FaFile,
  FaFileAlt,
  FaDesktop,
  FaUtensils,
  FaLeaf,
  FaBaby,
  FaBox,
  FaPaw,
  FaGamepad,
  FaArchive,
  FaBoxes,
  FaTools,
} from 'react-icons/fa';
import {
  FaCouch,
  FaFileArrowDown,
  FaPuzzlePiece,
  FaAppleWhole,
} from 'react-icons/fa6';
import { PiPottedPlantFill } from 'react-icons/pi';
import { IoFileTrayStacked, IoShapes } from 'react-icons/io5';
import { BiSolidFridge } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { IoIosPaper } from 'react-icons/io';
import { MdSmartToy } from 'react-icons/md';

export const NO_CATEGORY_VALUE = '__none__';

export enum ItemCategory {
  APPLIANCES = 'APPLIANCES',
  AUTO = 'AUTO',
  BATH = 'BATH',
  CLOTHING = 'CLOTHING',
  DECOR = 'DECOR',
  DIGITAL = 'DIGITAL',
  DOCUMENTS = 'DOCUMENTS',
  ELECTRONICS = 'ELECTRONICS',
  FOOD = 'FOOD',
  FURNITURE = 'FURNITURE',
  GARDEN = 'GARDEN',
  KIDS = 'KIDS',
  OTHER = 'OTHER',
  PETS = 'PETS',
  RECREATION = 'RECREATION',
  STORAGE = 'STORAGE',
  SUPPLIES = 'SUPPLIES',
  TOOLS = 'TOOLS',
}

export const categoryIcons: Record<ItemCategory, IconType> = {
  [ItemCategory.APPLIANCES]: BiSolidFridge,
  [ItemCategory.AUTO]: FaCar,
  [ItemCategory.BATH]: FaBath,
  [ItemCategory.CLOTHING]: FaTshirt,
  [ItemCategory.DECOR]: FaPaintBrush,
  [ItemCategory.DIGITAL]: FaFileArrowDown,
  [ItemCategory.DOCUMENTS]: IoIosPaper,
  [ItemCategory.ELECTRONICS]: FaDesktop,
  [ItemCategory.FOOD]: FaAppleWhole,
  [ItemCategory.FURNITURE]: FaCouch,
  [ItemCategory.GARDEN]: PiPottedPlantFill,
  [ItemCategory.KIDS]: MdSmartToy,
  [ItemCategory.OTHER]: IoShapes,
  [ItemCategory.PETS]: FaPaw,
  [ItemCategory.RECREATION]: FaGamepad,
  [ItemCategory.STORAGE]: IoFileTrayStacked,
  [ItemCategory.SUPPLIES]: FaBoxes,
  [ItemCategory.TOOLS]: FaTools,
};
