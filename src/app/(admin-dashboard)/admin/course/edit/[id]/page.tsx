import { type Metadata } from 'next';
import { CourseEdit } from './course-edit';
import { getServerAuthSession } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Edit Course | Coursemaster',
  description: 'Edit course information',
};

export default async function CourseEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;

  const session = await getServerAuthSession();
  if (!session || !session.role) return redirect('/login');

  return (
    <main className="px-2 md:px-4 py-8">
      <CourseEdit courseId={id} />
    </main>
  );
}
