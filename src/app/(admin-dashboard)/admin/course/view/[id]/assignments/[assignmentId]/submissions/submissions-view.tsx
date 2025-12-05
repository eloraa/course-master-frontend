'use client';

import { DataTable } from '@/components/data-table/data-table';
import * as React from 'react';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { type PaginationState } from '@tanstack/react-table';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';
import { RefreshButton } from '@/components/data-table/refresh-table';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getColumns } from './columns';
import { useAssignmentSubmissions, type SubmissionsListFilters } from '@/data/admin/assignment-submissions';

interface SubmissionsViewProps {
  courseId: string;
  assignmentId: string;
}

export const SubmissionsView = ({ courseId, assignmentId }: SubmissionsViewProps) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const filters: SubmissionsListFilters = {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
  };

  const { data, isLoading, refetch, isRefetching } = useAssignmentSubmissions(assignmentId, filters);

  const pageCount = data ? data.data.pagination.totalPages : 0;

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  const { submissions } = data.data;
  const columns = getColumns(assignmentId);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/course/view/${courseId}/assignments`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Assignment Submissions</h1>
          <p className="text-muted-foreground text-sm">Grade and review student submissions</p>
        </div>
      </div>

      <DataTable
        search="user"
        placeholder="Search by student name..."
        columns={columns}
        data={submissions}
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
