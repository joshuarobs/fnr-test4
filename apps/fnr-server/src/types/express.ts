import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarColour?: string | null;
    role: UserRole;
    isActive: boolean;
    lastLogin?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt?: Date | null;
    staff?: {
      id: number;
      baseUserId: number;
      department: string;
      employeeId: string;
      position: string;
      permissions: string[];
      isDeleted: boolean;
      deletedAt?: Date | null;
    } | null;
  };
}
