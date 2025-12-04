'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'Add an uppercase letter')
  .regex(/[a-z]/, 'Add a lowercase letter')
  .regex(/[0-9]/, 'Add a number')
  .regex(/[^A-Za-z0-9]/, 'Add a special character');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: passwordSchema,
});

type RegisterFieldErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

type RegisterValues = {
  name: string;
  email: string;
};

type RegisterState = {
  message?: string;
  fieldErrors?: RegisterFieldErrors;
  values?: RegisterValues;
};

const emptyFieldErrors: RegisterFieldErrors = {
  name: undefined,
  email: undefined,
  password: undefined,
};

export async function register(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const rawData = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    return {
      message: 'Please fix the errors below and try again.',
      fieldErrors: {
        name: fieldErrors.name,
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return {
      message: 'API_URL is not configured on the server.',
      fieldErrors: emptyFieldErrors,
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    const responseBody = await res.json().catch(() => null);

    if (!res.ok || responseBody?.status !== 'success') {
      type ApiError = { field?: string; messages?: string[] };

      const apiErrors: ApiError[] | null = Array.isArray(responseBody?.errors)
        ? (responseBody.errors as ApiError[])
        : null;

      const apiFieldErrors = apiErrors
        ? apiErrors.reduce<RegisterFieldErrors>((acc, error) => {
            if (!error?.field || !Array.isArray(error.messages) || error.messages.length === 0) {
              return acc;
            }

            if (error.field === 'name' || error.field === 'email' || error.field === 'password') {
              acc[error.field] = error.messages;
            }

            return acc;
          }, { ...emptyFieldErrors })
        : emptyFieldErrors;

      const hasFieldErrors =
        apiFieldErrors.name?.length || apiFieldErrors.email?.length || apiFieldErrors.password?.length;

      return {
        message: hasFieldErrors ? undefined : responseBody?.message ?? 'Registration failed',
        fieldErrors: apiFieldErrors,
        values: {
          name: rawData.name,
          email: rawData.email,
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Something went wrong. Please try again.',
      fieldErrors: emptyFieldErrors,
      values: {
        name: rawData.name,
        email: rawData.email,
      },
    };
  }

  redirect('/login');
}
