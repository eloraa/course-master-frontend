'use client';

import { DataTable } from '@/components/data-table/data-table';
import * as React from 'react';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { type PaginationState } from '@tanstack/react-table';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';
import { RefreshButton } from '@/components/data-table/refresh-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getColumns } from './columns';
import { useQuizzesList, type QuizListFilters } from '@/data/admin/quizzes';

interface QuizViewProps {
  courseId: string;
}

export const QuizView = ({ courseId }: QuizViewProps) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const filters: QuizListFilters = {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    course: courseId,
  };

  const { data, isLoading, refetch, isRefetching } = useQuizzesList(filters);

  const pageCount = data ? data.pagination.totalPages : 0;

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  const { data: quizzes } = data;
  const columns = getColumns(courseId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quizzes</h1>
          <p className="text-muted-foreground text-sm">Manage course quizzes</p>
        </div>
        <Button asChild>
          <Link href={`/admin/course/view/${courseId}/quiz/create`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <DataTable
        search="title"
        placeholder="Search by title..."
        columns={columns}
        data={quizzes}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        customFilter={[
          {
            filter: RefreshButton,
            label: 'Refresh',
            props: { onClick: refetch, isLoading: isRefetching || isLoading },
          },
        ]}
      />
    </div>
  );
};
