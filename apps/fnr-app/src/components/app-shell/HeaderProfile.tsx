import React from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
} from '@react-monorepo/shared';

// Component for displaying profile button in the header
export const HeaderProfile = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
};
