import React from 'react';
import { Button } from '@react-monorepo/shared';

// Test fill button for sign up form
interface SignUpTestFillButtonProps {
  form: any; // Using any for brevity, but represents react-hook-form's form control
}

// List of test names
const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];

export const SignUpTestFillButton = ({ form }: SignUpTestFillButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        // Generate random values for mandatory fields
        const randomFirstName =
          FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const randomLastName =
          LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

        // Generate random email using the name
        const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${Math.floor(
          Math.random() * 1000
        )}@example.com`;

        // Generate password that meets requirements (uppercase, lowercase, number)
        const randomPassword = `Test${Math.floor(Math.random() * 10000)}Pwd`;

        // Default to STAFF role for testing
        const role = 'STAFF';

        // Set values with shouldDirty and shouldValidate options
        form.setValue('email', randomEmail, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('password', randomPassword, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('firstName', randomFirstName, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('lastName', randomLastName, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('role', role, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
    >
      Test fill fields
    </Button>
  );
};
