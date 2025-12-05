import { CourseLearningView } from './course-learning-view';

interface CourseLearningPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseLearningPage({ params }: CourseLearningPageProps) {
  const { slug } = await params;

  return <CourseLearningView slug={slug} />;
}
