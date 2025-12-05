import { getServerAuthSession } from '@/lib/server/auth';
import { QueryProvider } from '../providers';
import { Header } from '@/components/student-portal/header/header';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  console.log(session);

  return (
    <QueryProvider>
      <Header initialSession={session} />
      {children}
    </QueryProvider>
  );
}
