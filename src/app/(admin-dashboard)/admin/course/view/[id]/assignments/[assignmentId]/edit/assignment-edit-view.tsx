'use client';

import { useAssignmentById } from '@/data/admin/assignments';
import { AssignmentForm } from '../../assignment-form';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';

interface AssignmentEditViewProps {
  courseId: string;
  assignmentId: string;
}

export const AssignmentEditView = ({ courseId, assignmentId }: AssignmentEditViewProps) => {
  const { data, isLoading } = useAssignmentById(assignmentId);

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  return <AssignmentForm courseId={courseId} assignment={data.data} />;
};
