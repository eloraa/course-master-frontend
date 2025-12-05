import { LessonView } from './lesson-view';

interface LessonPageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params;

  return <LessonView slug={slug} lessonId={lessonId} />;
}
