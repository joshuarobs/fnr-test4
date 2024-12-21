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
  assignedAgent: z.string().min(1, 'Please select an agent'),
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
  assignedAgent: '',
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
  const onSubmit = (values: FormValues) => {
    console.log('Form submitted:', {
      ...values,
      blankItems: values.blankItems ? parseInt(values.blankItems) : 0,
    });
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
      <h1 className="text-2xl font-semibold mb-4">Create a new claim</h1>
      <Separator className="mb-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6 max-w-2xl">
            {/* Claim Number */}
            <FormField
              control={form.control}
              name="claimNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Claim number</FormLabel>
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
                  <FormLabel>Agent assigned to</FormLabel>
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
