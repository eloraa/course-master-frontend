'use client';

import { useQuizById } from '@/data/admin/quizzes';
import { QuizForm } from '../../quiz-form';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';

interface QuizEditViewProps {
  courseId: string;
  quizId: string;
}

export const QuizEditView = ({ courseId, quizId }: QuizEditViewProps) => {
  const { data, isLoading } = useQuizById(quizId);

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  return <QuizForm courseId={courseId} quiz={data.data} />;
};
