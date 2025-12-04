'use client';

import { DataTable } from '@/components/data-table/data-table';
import { sanitizeObject } from '@/components/data-table/utils';
import * as React from 'react';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { type PaginationState } from '@tanstack/react-table';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';
import { RefreshButton } from '@/components/data-table/refresh-table';
import { useSearchParams } from 'next/navigation';
import { DataInput } from '@/components/data-table/data-table-input';
import { debounce } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { columns } from './columns';
import { useCoursesList, type CourseListFilters } from '@/data/admin/courses';
import { LevelFilter } from './level-filter';
import { PublishStatusFilter } from './publish-status-filter';
import { CategoryFilter } from './category-filter';

export interface CoursesListProps {
  initialFilters?: CourseListFilters;
}

export const CoursesList = ({ initialFilters = {} }: CoursesListProps) => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [level, setLevel] = React.useState<'beginner' | 'intermediate' | 'advanced' | undefined>(initialFilters.level);
  const [isPublished, setIsPublished] = React.useState<boolean | undefined>(initialFilters.isPublished);
  const [category, setCategory] = React.useState<string | undefined>(initialFilters.category);

  const filters: CourseListFilters = {
    page: pagination.pageIndex + 1,
    perPage: pagination.pageSize,
    search: debouncedSearch || searchQuery || undefined,
    level,
    isPublished,
    category,
  };

  const { data, isLoading, refetch, isRefetching } = useCoursesList(filters);

  const debouncedSetSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setTimeout(() => {
          refetch();
        }, 50);
      }, 500),
    [refetch]
  );

  const handleSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const pageCount = data ? data.pagination.totalPages : 0;

  if (isLoading) return <DataTableSkeleton />;

  if (!data && !isLoading) return <SomethingWentWrong />;
  if (!data) return null;

  const { data: courses } = data;

  return (
    <div className="space-y-4">
      <DataTable
        search={[
          {
            label: 'Remote',
            value: 'remote',
            input: (
              <div className="relative flex items-center">
                <DataInput
                  placeholder="Search by title or description..."
                  className="rounded-r-none pr-9"
                  onChange={handleSearchChange}
                  defaultValue={debouncedSearch}
                />
                {isRefetching ? <Spinner className="size-4 absolute right-2" /> : null}
              </div>
            ),
          },
          {
            label: 'Title/Description',
            value: 'search',
          },
        ]}
        placeholder="Filter by title or description"
        data={sanitizeObject(courses)}
        columns={columns}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={pageCount}
        pageSizes={[10, 20, 50]}
        customFilter={[
          {
            filter: LevelFilter,
            label: 'Level',
            props: { level, onChange: setLevel },
          },
          {
            filter: PublishStatusFilter,
            label: 'Status',
            props: { isPublished, onChange: setIsPublished },
          },
          {
            filter: CategoryFilter,
            label: 'Category',
            props: { category, onChange: setCategory },
          },
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
