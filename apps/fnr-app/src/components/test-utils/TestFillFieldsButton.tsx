import React from 'react';
import { Button } from '@react-monorepo/shared';

// Test fill fields button component
interface TestFillFieldsButtonProps {
  agents: string[];
  form: any; // Using any for brevity, but you could define proper form type
}

// List of insurance claim scenarios involving damaged or lost contents
const CLAIM_SCENARIOS = [
  'Water damage to garage tools and equipment from burst pipe',
  'Fire damage to living room furniture and electronics',
  'Storm damage to basement storage items from flooding',
  'Theft of jewelry and electronics from master bedroom',
  'Smoke damage to clothing and furniture throughout house',
  'Lightning strike damaged home office equipment and furniture',
  'Vandalism damage to outdoor furniture and garden equipment',
  'Plumbing leak damaged kitchen appliances and cabinets',
  'Wind storm damaged patio furniture and outdoor equipment',
  'Accidental water damage to bedroom furniture from broken AC unit',
];

export const TestFillFieldsButton = ({
  agents,
  form,
}: TestFillFieldsButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        // Generate random values for mandatory fields
        const randomClaimNumber = `CLM${Math.floor(
          Math.random() * 900000 + 100000
        )}`;
        const randomPolicyNumber = `POL${Math.floor(
          Math.random() * 900000 + 100000
        )}`;
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        // Get random scenario from the list
        const randomDescription =
          CLAIM_SCENARIOS[Math.floor(Math.random() * CLAIM_SCENARIOS.length)];

        // Generate random number of blank items
        // 30% chance of 0, 70% chance of 1-20
        const randomBlankItems =
          Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 20) + 1;

        // Generate random date within past 2 months
        const today = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(today.getMonth() - 2);
        const randomDate = new Date(
          twoMonthsAgo.getTime() +
            Math.random() * (today.getTime() - twoMonthsAgo.getTime())
        );

        // Set values with shouldDirty and shouldValidate options
        form.setValue('claimNumber', randomClaimNumber, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('policyNumber', randomPolicyNumber, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('assignedAgent', randomAgent, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('description', randomDescription, {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('incidentDate', randomDate.toISOString().split('T')[0], {
          shouldDirty: true,
          shouldValidate: true,
        });
        form.setValue('blankItems', randomBlankItems.toString(), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
    >
      Test fill fields
    </Button>
  );
};
