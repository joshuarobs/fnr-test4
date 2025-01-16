import React from 'react';
import { Button } from '@react-monorepo/shared';

// Test fill button for staff sign up form
interface StaffSignupTestFillButtonProps {
  form: any; // Using any for brevity, but represents react-hook-form's form control
  className?: string;
}

// List of test names
const FIRST_NAMES = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
const DEPARTMENTS = ['Storm', 'BAU', 'Motor'] as const;
const POSITIONS = ['Agent', 'Team Leader', 'QA'] as const;

export const StaffSignupTestFillButton = ({
  form,
  className,
}: StaffSignupTestFillButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
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

        // Use fixed password as required
        const password = '12345';

        // Generate random employee ID
        const randomEmployeeId = `EMP${Math.floor(
          Math.random() * 90000 + 10000
        )}`;

        // Random department and position
        const randomDepartment =
          DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        const randomPosition =
          POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

        // Set values with shouldDirty and shouldValidate options
        form.setValue('email', randomEmail, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('password', password, {
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
        form.setValue('employeeId', randomEmployeeId, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('department', randomDepartment, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('position', randomPosition, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
    >
      Test fill fields
    </Button>
  );
};
