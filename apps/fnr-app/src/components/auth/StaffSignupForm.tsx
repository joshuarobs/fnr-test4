import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from '../../store/services/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@react-monorepo/shared';
import { ChevronsUpDown } from 'lucide-react';

// Department and Position options
const DEPARTMENTS = ['Storm', 'BAU', 'Motor'] as const;
const POSITIONS = ['Agent', 'Team Leader', 'QA'] as const;

// Form validation schema
const staffSignUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number')
    .optional(),
  // New staff-specific fields with enums
  department: z.enum(DEPARTMENTS, {
    required_error: 'Department is required',
  }),
  position: z.enum(POSITIONS, {
    required_error: 'Position is required',
  }),
  employeeId: z.string().min(1, 'Employee ID is required'),
});

type StaffSignUpFormData = z.infer<typeof staffSignUpSchema>;

// Form component with API integration
export const StaffSignupForm = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();
  const form = useForm<StaffSignUpFormData>({
    resolver: zodResolver(staffSignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      department: undefined,
      position: undefined,
      employeeId: '',
    },
  });

  // Handle form submission with API integration
  const onSubmit = async (data: StaffSignUpFormData) => {
    try {
      // Add role as STAFF since this is specifically for staff signup
      await signUp({ ...data, role: 'STAFF' }).unwrap();
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Error submitting form:', error);
      // TODO: Add proper error handling/display
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Staff Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create a staff account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Employee ID */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value || 'Select Department'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full min-w-[200px]">
                      {DEPARTMENTS.map((dept) => (
                        <DropdownMenuItem
                          key={dept}
                          onClick={() => field.onChange(dept)}
                          className="cursor-pointer"
                        >
                          {dept}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Position */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {field.value || 'Select Position'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full min-w-[200px]">
                      {POSITIONS.map((pos) => (
                        <DropdownMenuItem
                          key={pos}
                          onClick={() => field.onChange(pos)}
                          className="cursor-pointer"
                        >
                          {pos}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create staff account'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StaffSignupForm;
