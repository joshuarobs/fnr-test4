import React, { useState } from 'react';
import { TestFillFieldsButton } from '../components/test-utils/TestFillFieldsButton';
import { useForm } from 'react-hook-form';
import { getClaimRoute } from '../routes';
import { getApiUrl } from '../config';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Separator,
  InputClearable,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton,
} from '@react-monorepo/shared';
import { UserSearchDropdown } from '../components/claims/UserSearchDropdown';
import { useGetStaffUsersQuery } from '../store/services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  department?: string;
  avatarColour?: string;
}

// Form schema
const formSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  policyNumber: z.string().optional(),
  assignedAgent: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      department: z.string().optional(),
      avatarColour: z.string().optional(),
    })
    .nullable(),
  description: z.string().optional(),
  incidentDate: z.string().optional(),
  blankItems: z.string().refine(
    (val) => {
      if (!val) return true; // Optional field
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    },
    {
      message: 'Must be a positive number',
    }
  ),
});

type FormValues = z.infer<typeof formSchema>;

// Default values for the form fields
const DEFAULT_VALUES: FormValues = {
  claimNumber: '',
  policyNumber: '',
  assignedAgent: null,
  description: '',
  incidentDate: new Date().toISOString().split('T')[0], // Today's date as default
  blankItems: '',
};

// Page component for creating a new claim
export const CreateClaimPage = () => {
  const { data: staffUsers, isLoading, error } = useGetStaffUsersQuery();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Transform staff users to match UserSearchDropdown interface
  const users =
    staffUsers?.map((user) => ({
      id: user.staff?.employeeId || String(user.id),
      firstName: user.firstName,
      lastName: user.lastName,
      department: user.staff?.employeeId ? undefined : 'Staff',
      avatarColour: user.avatarColour || undefined,
    })) || [];

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch(getApiUrl('claims'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...values,
          assignedAgent: values.assignedAgent?.id, // Just send the ID as assignedAgent
          blankItems: values.blankItems ? parseInt(values.blankItems) : 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create claim');
      }

      const claim = await response.json();
      // Redirect to the claim page using route helper
      window.location.href = getClaimRoute(claim.claimNumber);
    } catch (error) {
      console.error('Error creating claim:', error);
      form.setError('root', {
        type: 'manual',
        message:
          error instanceof Error ? error.message : 'Failed to create claim',
      });
    }
  };

  // Clear all fields
  const handleClearFields = () => {
    form.reset(DEFAULT_VALUES);
    setSelectedUser(null); // Clear the selected user state
  };

  return (
    <div className="p-6 w-[800px] mx-auto">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold">Create a new claim</h1>
      </div>
      <Separator className="mb-4" />
      {form.formState.errors.root && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {form.formState.errors.root.message}
        </div>
      )}
      <p className="italic text-sm text-muted-foreground mb-6">
        Required fields are marked with an asterisk (*)
      </p>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Only submit if the submit button was clicked
            if (
              (e.nativeEvent as SubmitEvent).submitter?.getAttribute('type') ===
              'submit'
            ) {
              form.handleSubmit(onSubmit)(e);
            }
          }}
        >
          <div className="space-y-6 max-w-2xl">
            {/* Agent Assigned */}
            <FormField
              control={form.control}
              name="assignedAgent"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Agent assigned to *</FormLabel>
                  <FormControl>
                    <div>
                      {isLoading ? (
                        <Skeleton className="h-[48px] w-[240px]" />
                      ) : error ? (
                        <div className="text-red-500">Error loading users</div>
                      ) : (
                        <UserSearchDropdown
                          selectedUser={selectedUser}
                          onUserSelect={(user) => {
                            setSelectedUser(user);
                            field.onChange(user);
                          }}
                          users={users}
                          showChevron
                          className="min-w-[240px] min-h-[48px]"
                          dropdownWidth="w-[240px]"
                        />
                      )}
                    </div>
                  </FormControl>
                  {form.formState.errors.assignedAgent && (
                    <FormMessage>
                      {form.formState.errors.assignedAgent.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Claim Number */}
            <FormField
              control={form.control}
              name="claimNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Claim number *</FormLabel>
                  <FormControl>
                    <InputClearable
                      {...field}
                      id="claimNumber"
                      onClear={() => field.onChange('')}
                      className="w-[200px]"
                      autoComplete="off"
                    />
                  </FormControl>
                  {form.formState.errors.claimNumber && (
                    <FormMessage>
                      {form.formState.errors.claimNumber.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Policy Number */}
            <FormField
              control={form.control}
              name="policyNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Policy number</FormLabel>
                  <FormControl>
                    <InputClearable
                      {...field}
                      id="policyNumber"
                      onClear={() => field.onChange('')}
                      className="w-[200px]"
                      autoComplete="off"
                    />
                  </FormControl>
                  {form.formState.errors.policyNumber && (
                    <FormMessage>
                      {form.formState.errors.policyNumber.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Claim description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      id="description"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  {form.formState.errors.description && (
                    <FormMessage>
                      {form.formState.errors.description.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Incident Date */}
            <FormField
              control={form.control}
              name="incidentDate"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Incident date</FormLabel>
                  <FormControl>
                    <InputClearable
                      {...field}
                      id="incidentDate"
                      type="date"
                      onClear={() => field.onChange('')}
                      className="w-[200px]"
                    />
                  </FormControl>
                  {form.formState.errors.incidentDate && (
                    <FormMessage>
                      {form.formState.errors.incidentDate.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Blank Items */}
            <FormField
              control={form.control}
              name="blankItems"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Starting number of blank items</FormLabel>
                  <FormControl>
                    <InputClearable
                      {...field}
                      id="blankItems"
                      type="number"
                      onClear={() => field.onChange('')}
                      className="w-[120px]"
                    />
                  </FormControl>
                  {form.formState.errors.blankItems && (
                    <FormMessage>
                      {form.formState.errors.blankItems.message}
                    </FormMessage>
                  )}
                  <p className="text-sm text-muted-foreground">
                    The number of blank items to start with. You can easily edit
                    those values.
                  </p>
                </FormItem>
              )}
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearFields}
              disabled={!form.formState.isDirty}
              className="text-red-500"
            >
              Clear fields
            </Button>
            <div className="flex gap-2">
              <TestFillFieldsButton
                agents={users}
                form={form}
                onUserSelect={setSelectedUser}
              />
              <Button
                type="submit"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                Create new claim
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
