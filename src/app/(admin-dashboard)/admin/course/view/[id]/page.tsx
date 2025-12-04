import { type Metadata } from 'next';
import { CourseView } from './course-view';
import { StickyHeaders } from '@/components/admin-dashboard/header/sticky-header';

interface CourseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Course Details | Coursemaster',
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  return (
    <>
      <StickyHeaders
        links={[
          {
            label: 'Overview',
            href: '/admin/course/view/' + id,
          },
          {
            label: 'Modules',
            href: '/admin/course/view/' + id + '/modules',
          },
          {
            label: 'Assignments',
            href: '/admin/course/view/' + id + '/assignments',
          },
        ]}
        label="Course Details"
        width={'Course Details'.length - 3}
      />
      <main className="px-2 md:px-4 py-8">
        <CourseView courseId={id} />
      </main>
    </>
  );
}
