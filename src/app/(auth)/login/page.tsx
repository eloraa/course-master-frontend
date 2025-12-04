import type { Metadata } from 'next';
import { LoginForm } from './form';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Login | Coursemaster',
};

export default function Login() {
  return (
    <main className="h-full flex max-md:pt-26 md:items-center justify-center container">
      <div className="w-full md:max-w-sm space-y-4">
        <h1>Login</h1>
        <Button variant="secondary" size="sm" className="w-full border-input border cursor-pointer font-medium">
          <GoogleIcon className="size-3" />
          Continue with Google
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
