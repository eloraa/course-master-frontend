'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { register } from './action';

const passwordRequirements = ['At least 8 characters', 'Uppercase & lowercase letters', 'At least one number', 'At least one special character'];

const initialRegisterState = {
  message: undefined as string | undefined,
  fieldErrors: {
    name: undefined as string[] | undefined,
    email: undefined as string[] | undefined,
    password: undefined as string[] | undefined,
  },
  values: {
    name: '',
    email: '',
  },
};

type FieldErrorProps = {
  errors?: string[];
};

function FieldError({ errors }: FieldErrorProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="text-xs text-destructive-foreground font-mono space-y-1">
      {errors.map(error => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer disabled:opacity-100 disabled:bg-muted dark:disabled:bg-muted disabled:text-primary border border-input"
    >
      {pending ? (
        <div className="flex justify-center items-center w-full">
          <Spinner className="size-5" />
        </div>
      ) : (
        'Create account'
      )}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, initialRegisterState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full name
        </label>
        <Input id="name" name="name" placeholder="Jane Doe" defaultValue={state.values?.name ?? ''} required />
        <FieldError errors={state.fieldErrors?.name} />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="jane@example.com" defaultValue={state.values?.email ?? ''} required />
        <FieldError errors={state.fieldErrors?.email} />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" name="password" type="password" placeholder="Secure password" required />
        <FieldError errors={state.fieldErrors?.password} />
        <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
          {passwordRequirements.map(requirement => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>

      {state.message && <div className="text-sm text-destructive-foreground">{state.message}</div>}

      <SubmitButton />

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{' '}
        <Link href="/login" className="font-medium underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
