import { StickyHeaders } from '@/components/admin-dashboard/header/sticky-header';
import { QuizForm } from '../quiz-form';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuizCreatePage({ params }: PageProps) {
  const { id: courseId } = await params;

  return (
    <>
      <StickyHeaders
        links={[
          {
            label: 'Overview',
            href: '/admin/course/view/' + courseId,
          },
          {
            label: 'Modules',
            href: '/admin/course/view/' + courseId + '/modules',
          },
          {
            label: 'Quiz',
            href: '/admin/course/view/' + courseId + '/quiz',
          },
          {
            label: 'Assignments',
            href: '/admin/course/view/' + courseId + '/assignments',
          },
        ]}
        label="Course Details"
        width={'Course Details'.length - 3}
      />
      <main className="px-2 md:px-4 py-8">
        <QuizForm courseId={courseId} />
      </main>
    </>
  );
}
