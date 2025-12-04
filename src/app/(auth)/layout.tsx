import { Header } from '@/components/auth/header';
import { getServerAuthSession } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  console.log(session);
  if (session) redirect('/');

  return (
    <>
      <Header />
      {children}
    </>
  );
}
