import { CourseDetailsView } from './course-details-view';

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  return (
    <main className="flex-1">
      <CourseDetailsView slug={slug} />
    </main>
  );
}
