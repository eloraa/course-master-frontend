import { type Metadata } from 'next';
import { CourseCreate } from './course-create';
import { getServerAuthSession } from '@/lib/server/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Course | Coursemaster',
  description: 'Create a new course',
};

export default async function CourseCreatePage() {
  const session = await getServerAuthSession();
  if (!session || !session.role) return redirect('/login');

  return (
    <main className="px-2 md:px-4 py-8">
      <CourseCreate />
    </main>
  );
}
