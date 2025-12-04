import { getServerAuthSession } from '@/lib/server/auth';
import { redirect } from 'next/navigation';
import { QueryProvider } from '../providers';
import { Header } from '@/components/admin-dashboard/header/header';

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
  if (!session.role) return redirect('/logout');
  if (session.role !== 'admin') return redirect('/logout');

  return (
    <QueryProvider>
      <Header />
      {children}
      {settingsModal}
    </QueryProvider>
  );
}
