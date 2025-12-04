import { type Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { CoursesList } from '../courses-list';
import { COURSE_ROOT_STATUSES, type CourseRootStatus } from '@/data/admin/courses';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'Courses | Coursemaster',
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return COURSE_ROOT_STATUSES.map(status => ({
    status,
  }));
}

export default async function CoursesStatusPage({ params: statusPromise }: { params: Promise<{ status: CourseRootStatus }> }) {
  const { status } = await statusPromise;

  return (
    <main className="px-2 md:px-4 py-8">
      <div className="flex items-center gap-4 justify-between pb-4">
        <h1>Courses - {status.charAt(0).toUpperCase() + status.slice(1)}</h1>
        <Button size="sm" variant="default" asChild>
          <Link href="/admin/course/create">
            <PlusIcon className="h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <TooltipProvider delayDuration={0}>
        <CoursesList initialFilters={{ isPublished: status === 'published' }} />
      </TooltipProvider>
    </main>
  );
}
