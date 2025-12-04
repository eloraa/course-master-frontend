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
import { useAssignmentsList, type AssignmentListFilters } from '@/data/admin/assignments';

interface AssignmentsViewProps {
  courseId: string;
}

export const AssignmentsView = ({ courseId }: AssignmentsViewProps) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const filters: AssignmentListFilters = {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    course: courseId,
  };

  const { data, isLoading, refetch, isRefetching } = useAssignmentsList(filters);

  const pageCount = data ? data.pagination.totalPages : 0;

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  const { data: assignments } = data;
  const columns = getColumns(courseId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground text-sm">Manage course assignments</p>
        </div>
        <Button asChild>
          <Link href={`/admin/course/view/${courseId}/assignments/create`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Link>
        </Button>
      </div>

      <DataTable
        search="title"
        placeholder="Search by title..."
        columns={columns}
        data={assignments}
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
