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
} from '@react-monorepo/shared';
import { Input } from '@react-monorepo/shared';
import { Button } from '@react-monorepo/shared';
import { SignUpTestFillButton } from '../test-utils/SignUpTestFillButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@react-monorepo/shared';

// Form validation schema
const signUpSchema = z.object({
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
  role: z.enum(['STAFF', 'ADMIN', 'SUPPLIER', 'INSURED'], {
    required_error: 'Please select a role',
  }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// Form component with API integration
export const SignUpForm = () => {
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      middleName: '',
      lastName: '',
      phone: '',
      role: undefined,
    },
  });

  // Handle form submission with API integration
  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data).unwrap();
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
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
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

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPPLIER">Supplier</SelectItem>
                    <SelectItem value="INSURED">Insured</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <SignUpTestFillButton form={form} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
