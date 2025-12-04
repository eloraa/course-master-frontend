import { StickyHeaders } from '@/components/admin-dashboard/header/sticky-header';
import { AssignmentEditView } from './assignment-edit-view';

interface PageProps {
  params: Promise<{
    id: string;
    assignmentId: string;
  }>;
}

export default async function AssignmentEditPage({ params }: PageProps) {
  const { id: courseId, assignmentId } = await params;

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
        <AssignmentEditView courseId={courseId} assignmentId={assignmentId} />
      </main>
    </>
  );
}
