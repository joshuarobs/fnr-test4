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
  Appliances = 'Appliances',
  Auto = 'Auto',
  Bath = 'Bath',
  Clothing = 'Clothing',
  Decor = 'Decor',
  Digital = 'Digital',
  Documents = 'Documents',
  Electronics = 'Electronics',
  Food = 'Food',
  Furniture = 'Furniture',
  Garden = 'Garden',
  Kids = 'Kids',
  Other = 'Other',
  Pets = 'Pets',
  Recreation = 'Recreation',
  Storage = 'Storage',
  Supplies = 'Supplies',
  Tools = 'Tools',
}

export const categoryIcons: Record<ItemCategory, IconType> = {
  [ItemCategory.Appliances]: BiSolidFridge,
  [ItemCategory.Auto]: FaCar,
  [ItemCategory.Bath]: FaBath,
  [ItemCategory.Clothing]: FaTshirt,
  [ItemCategory.Decor]: FaPaintBrush,
  [ItemCategory.Digital]: FaFileArrowDown,
  [ItemCategory.Documents]: IoIosPaper,
  [ItemCategory.Electronics]: FaDesktop,
  [ItemCategory.Food]: FaAppleWhole,
  [ItemCategory.Furniture]: FaCouch,
  [ItemCategory.Garden]: PiPottedPlantFill,
  [ItemCategory.Kids]: MdSmartToy,
  [ItemCategory.Other]: IoShapes,
  [ItemCategory.Pets]: FaPaw,
  [ItemCategory.Recreation]: FaGamepad,
  [ItemCategory.Storage]: IoFileTrayStacked,
  [ItemCategory.Supplies]: FaBoxes,
  [ItemCategory.Tools]: FaTools,
};
