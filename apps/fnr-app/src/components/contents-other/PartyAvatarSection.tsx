import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@react-monorepo/shared';
import { NavAvatar } from './NavAvatar';

interface AvatarData {
  userInitials?: string;
  companyName?: string;
  color?: string;
  name: string; // Name field for displaying next to avatar (mandatory)
  userId: number; // User ID for navigation
  employeeId?: string; // Employee ID for staff profile routing
  isSupplier?: boolean; // Flag to determine if the user is a supplier
  supplierId?: string; // Supplier ID for supplier profile routing
}

interface PartyAvatarSectionProps {
  // Title for the section (optional)
  title?: string;
  // Array of avatar data
  avatars: AvatarData[];
}

export const PartyAvatarSection = ({
  title,
  avatars,
}: PartyAvatarSectionProps) => {
  return (
    <div>
      {/* Title row with badge showing number of avatars (if title provided) */}
      {title && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="inline-flex items-center gap-2 mb-2 cursor-pointer hover:text-hover-blue">
              <span className="text-base font-medium">{title}</span>
              <Badge variant="secondary">{avatars.length}</Badge>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {title}
                <Badge variant="secondary">{avatars.length}</Badge>
              </DialogTitle>
            </DialogHeader>
            {/* Show all avatars in vertical layout with full details */}
            <ScrollArea className="h-[160px] mt-4">
              <div className="flex flex-col gap-2 pr-4">
                {avatars.map((avatar, index) => (
                  <NavAvatar
                    key={index}
                    userInitials={avatar.userInitials}
                    companyName={avatar.companyName}
                    color={avatar.color}
                    name={avatar.name}
                    userId={avatar.userId}
                    employeeId={avatar.employeeId}
                    disableNavigation={false}
                    disableHoverText={!!avatar.companyName}
                    isSupplier={avatar.isSupplier}
                    supplierId={avatar.supplierId}
                  />
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}

      {/* Avatar section - vertical for 2 or less, horizontal for more */}
      {avatars.length <= 2 ? (
        // Vertical layout with names for 2 or fewer avatars
        <div className="flex flex-col gap-1">
          {avatars.map((avatar, index) => (
            <NavAvatar
              key={index}
              userInitials={avatar.userInitials}
              companyName={avatar.companyName}
              color={avatar.color}
              name={avatar.name}
              userId={avatar.userId}
              employeeId={avatar.employeeId}
              disableNavigation={false}
              //disableHoverText={!!avatar.companyName}
              isSupplier={avatar.isSupplier}
              supplierId={avatar.supplierId}
            />
          ))}
        </div>
      ) : (
        // Horizontal layout for more than 2 avatars (with hidden text)
        <div className="flex gap-0">
          {avatars.map((avatar, index) => (
            <NavAvatar
              key={index}
              userInitials={avatar.userInitials}
              companyName={avatar.companyName}
              color={avatar.color}
              name={avatar.name}
              userId={avatar.userId}
              employeeId={avatar.employeeId}
              disableNavigation={false}
              //disableHoverText={!!avatar.companyName}
              isSupplier={avatar.isSupplier}
              supplierId={avatar.supplierId}
              hideTextLabel={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
