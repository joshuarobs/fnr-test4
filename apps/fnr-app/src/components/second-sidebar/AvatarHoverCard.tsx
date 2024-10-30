import { CalendarDays } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@react-monorepo/shared';

interface AvatarHoverCardProps {
  avatar: string;
  name: string;
}

export const AvatarHoverCard = ({ avatar, name }: AvatarHoverCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <img
          src={avatar}
          alt={name}
          className="h-6 w-6 rounded-full cursor-pointer"
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-2">
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{name}</h4>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
