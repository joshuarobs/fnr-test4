import { GalleryVerticalEnd } from 'lucide-react';

// Empty signup form component - to be implemented with actual form fields
export const SignUpForm = () => {
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
      {/* Form fields will be added here */}
      <div className="flex flex-col gap-4"></div>
    </div>
  );
};

export default SignUpForm;
