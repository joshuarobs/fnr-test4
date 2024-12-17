import React from 'react';
import {
  Separator,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@react-monorepo/shared';
import { ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';

// Form schema
const accountFormSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  surname: z.string(),
  department: z.string(),
  location: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Account settings component for managing user profile information
export const AccountSettings = () => {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      title: '',
      firstName: '',
      surname: '',
      department: '',
      location: '',
    },
  });

  const onSubmit = (data: AccountFormValues) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className={SETTINGS_SUBPAGE_CONTAINER}>
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <Separator className="my-4" />

      <Alert className="mb-6">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Administrator Access Required</AlertTitle>
        <AlertDescription>
          These fields cannot be edited since you are not an administrator.
          Please contact your administrator for any changes.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 max-w-lg">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title"
                      {...field}
                      className="max-w-[160px]"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter first name"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Surname */}
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter surname"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter department"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location"
                      {...field}
                      className="max-w-[240px]"
                      autoComplete="off"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};
