'use client';
import { Spinner } from '@/components/ui/spinner';
import { useSession } from '@/lib/client/auth';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { QueryProvider } from '../providers';

function LogoutAction() {
  const { session, loading } = useSession();
  useEffect(() => {
    const logout = async () => {
      await signOut({ callbackUrl: '/login' });
      redirect('/login');
    };
    if (!loading && !session) redirect('/login');
    else if (!loading) logout();
  }, [loading, session]);
  return (
    <main className="h-full flex items-center justify-center container">
      <div className="flex items-center justify-center flex-col gap-4 w-full">
        <Spinner className="size-10" />
        Logging out...
      </div>
    </main>
  );
}

export default function Logout() {
  return (
    <QueryProvider>
      <LogoutAction />
    </QueryProvider>
  );
}
