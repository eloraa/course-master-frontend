import { getServerAuthSession } from '@/lib/server/auth';
import { redirect } from 'next/navigation';
import { QueryProvider } from '../providers';

export default async function AuthLayout({
  children,
  settingsModal,
}: Readonly<{
  children: React.ReactNode;
  settingsModal: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  console.log(session);

  if (!session) return redirect('/login');
  if (!session.role) return redirect('/login');

  return (
    <QueryProvider>
      {children}
      {settingsModal}
    </QueryProvider>
  );
}
