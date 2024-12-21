import { useState, useEffect } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Separator,
  InputClearable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@react-monorepo/shared';

// Form schema
const formSchema = z.object({
  claimNumber: z.string().min(1, 'Claim number is required'),
  policyNumber: z.string().optional(),
  assignedAgent: z.string().min(1, 'Please select an agent'),
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
  assignedAgent: '',
  description: '',
  incidentDate: new Date().toISOString().split('T')[0], // Today's date as default
  blankItems: '',
};

// Page component for creating a new claim
export const CreateClaimPage = () => {
  const [hasChanges, setHasChanges] = useState(false);

  // Mock agents data - replace with actual data source
  const agents = ['John Smith', 'Jane Doe', 'Mike Johnson'];

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch('http://localhost:3000/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          blankItems: values.blankItems ? parseInt(values.blankItems) : 0,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create claim');
      }

      const claim = await response.json();
      // Redirect to the claim page
      window.location.href = `/claims/${claim.claimNumber}`;
    } catch (error) {
      console.error('Error creating claim:', error);
      // TODO: Show error to user
    }
  };

  // Clear all fields
  const handleClearFields = () => {
    form.reset(DEFAULT_VALUES);
    setHasChanges(false);
  };

  // Track form changes
  const watchAllFields = form.watch();
  useEffect(() => {
    const hasFormChanges = Object.keys(DEFAULT_VALUES).some(
      (key) =>
        watchAllFields[key as keyof FormValues] !==
        DEFAULT_VALUES[key as keyof FormValues]
    );
    setHasChanges(hasFormChanges);
  }, [watchAllFields]);

  return (
    <div className="p-6 w-[800px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Create a new claim</h1>
        <Button
          variant="outline"
          onClick={() => {
            // Generate random values for mandatory fields
            const randomClaimNumber = `CLM${Math.floor(
              Math.random() * 900000 + 100000
            )}`;
            const randomPolicyNumber = `POL${Math.floor(
              Math.random() * 900000 + 100000
            )}`;
            const randomAgent =
              agents[Math.floor(Math.random() * agents.length)];
            const randomDescription = `Test claim created on ${new Date().toLocaleDateString()}`;

            // Generate random number of blank items
            // 30% chance of 0, 70% chance of 1-20
            const randomBlankItems =
              Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 20) + 1;

            // Set form values
            form.setValue('claimNumber', randomClaimNumber, {
              shouldValidate: true,
            });
            form.setValue('policyNumber', randomPolicyNumber, {
              shouldValidate: true,
            });
            form.setValue('assignedAgent', randomAgent, {
              shouldValidate: true,
            });
            form.setValue('description', randomDescription, {
              shouldValidate: true,
            });
            // Generate random date within past 2 months
            const today = new Date();
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(today.getMonth() - 2);
            const randomDate = new Date(
              twoMonthsAgo.getTime() +
                Math.random() * (today.getTime() - twoMonthsAgo.getTime())
            );
            form.setValue(
              'incidentDate',
              randomDate.toISOString().split('T')[0],
              { shouldValidate: true }
            );
            form.setValue('blankItems', randomBlankItems.toString(), {
              shouldValidate: true,
            });
          }}
        >
          Test fill fields
        </Button>
      </div>
      <Separator className="mb-4" />
      <p className="italic text-sm text-muted-foreground mb-6">
        Required fields are marked with an asterisk (*)
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 max-w-2xl">
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

            {/* Agent Assigned */}
            <FormField
              control={form.control}
              name="assignedAgent"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Agent assigned to *</FormLabel>
                  <FormControl>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[200px] justify-start"
                          >
                            {field.value || 'Select an agent'}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                          {agents.map((agent) => (
                            <DropdownMenuItem
                              key={agent}
                              onClick={() => field.onChange(agent)}
                            >
                              {agent}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Description</FormLabel>
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
          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearFields}
              disabled={!hasChanges}
              className="text-red-500"
            >
              Clear fields
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid || !hasChanges}
            >
              Create new claim
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
