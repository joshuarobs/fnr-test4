import { useState, useEffect, useCallback } from 'react';
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
  Button,
} from '@react-monorepo/shared';
import { UserAvatar } from '../../app-shell/UserAvatar';
import { ShieldAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SETTINGS_SUBPAGE_CONTAINER } from '../../../pages/SettingsPage';
import { useUser } from '../../providers/UserContext';
import { useUpdateUserDetailsMutation } from '../../../store/services/api';
import { useToast } from '@react-monorepo/shared';

import {
  ColorPaletteSelector,
  avatarColors,
  type AvatarColor,
} from './ColorPaletteSelector';

const accountFormSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  surname: z.string(),
  department: z.string(),
  location: z.string(),
  avatarColor: z.string(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Account settings component for managing user profile information
export const AccountSettings = () => {
  const user = useUser();
  const [selectedColor, setSelectedColor] = useState<AvatarColor>('blue');

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      title: '',
      firstName: '',
      surname: '',
      department: '',
      location: '',
      avatarColor: avatarColors.blue,
    },
  });

  // Pre-populate form with user data
  useEffect(() => {
    if (user) {
      // Find the color name from hex value
      const colorName = Object.entries(avatarColors).find(
        ([_, hex]) => hex === user.avatarColour
      )?.[0] as AvatarColor;

      if (colorName) {
        setSelectedColor(colorName);
      }

      form.reset({
        title: '', // Add these fields when available in the API
        firstName: user.firstName,
        surname: user.lastName,
        department: user.department,
        location: '', // Add when available in the API
        avatarColor: user.avatarColour,
      });
    }
  }, [user, form]);

  const [updateUserDetails, { isLoading }] = useUpdateUserDetailsMutation();
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (data: AccountFormValues) => {
      try {
        await updateUserDetails({
          employeeId: user.employeeId,
          firstName: data.firstName,
          lastName: data.surname,
          department: data.department,
          avatarColour: avatarColors[selectedColor],
        }).unwrap();

        toast({
          title: 'Success',
          description: 'Your profile has been updated successfully.',
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to update profile. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [updateUserDetails, selectedColor, toast]
  );

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
          <Separator className="my-4" />

          {/* Avatar Color Selection */}
          <div className="space-y-4">
            <div className="flex gap-12 items-start">
              <div className="space-y-4">
                <FormLabel>Avatar Colour</FormLabel>
                <ColorPaletteSelector
                  selectedColor={selectedColor}
                  onColorSelect={(color) => {
                    setSelectedColor(color);
                    form.setValue('avatarColor', avatarColors[color]);
                  }}
                />
              </div>
              {/* Avatar Preview */}
              <div className="space-y-4">
                <FormLabel>Preview</FormLabel>
                <UserAvatar
                  size="lg"
                  userInitials={
                    (form.watch('firstName')?.[0]?.toUpperCase() || '') +
                    (form.watch('surname')?.[0]?.toUpperCase() || '')
                  }
                  color={avatarColors[selectedColor]}
                  name={`${form.watch('firstName')} ${form.watch('surname')}`}
                  department={form.watch('department')}
                  showHeaderRing
                />
              </div>
            </div>
          </div>

          <Separator className="my-4" />
          <Button type="submit" variant="default" disabled={isLoading}>
            Update details
          </Button>
        </form>
      </Form>
    </div>
  );
};
