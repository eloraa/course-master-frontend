import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        'border py-1 px-2 bg-accent/5 rounded border-accent/10 w-full disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-blue-500 focus-within:ring-1 focus-within:outline-none text-sm placeholder:text-muted-foreground',
        className
      )}
      autoComplete="off"
      data-1p-ignore="true"
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
