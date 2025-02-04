import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  toast,
} from '@react-monorepo/shared';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoginMutation } from '../../store/services/api';
import { ROUTES } from '../../routes';

// Login form component that handles authentication
export const LoginForm = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Quick login handler for development mode
  const handleQuickLogin = async () => {
    setFormData({
      email: 'admin@example.com',
      password: '12345',
    });
    try {
      const result = await login({
        email: 'admin@example.com',
        password: '12345',
      }).unwrap();
      localStorage.setItem('token', result.token);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Quick login failed',
        description: 'Development login failed',
        variant: 'destructive',
      });
      localStorage.removeItem('token');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      // Store the token
      localStorage.setItem('token', result.token);
      // Navigate to the intended page or home
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again',
        variant: 'destructive',
      });
      localStorage.removeItem('token');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your Insurance account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onMouseDown={() => setIsPasswordVisible(true)}
                      onMouseUp={() => setIsPasswordVisible(false)}
                      onMouseLeave={() => setIsPasswordVisible(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                {/* Quick login button only shown in development */}
                {import.meta.env.DEV && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleQuickLogin}
                  >
                    Quick Login (Dev)
                  </Button>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="flex justify-center">
                <NavLink
                  to={ROUTES.SIGN_UP}
                  className="inline-flex px-2 py-1 text-sm hover:text-primary"
                >
                  Don't have an account?
                  <span className="ml-1 underline underline-offset-4">
                    Sign up
                  </span>
                </NavLink>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
