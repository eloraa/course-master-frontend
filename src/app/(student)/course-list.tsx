'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { CourseCard } from './course-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublicCoursesList } from '@/data/public/courses';

export const CourseList = ({ perPage = 12 }: { perPage?: number }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const { data, isLoading, error } = usePublicCoursesList({
    page: currentPage,
    perPage,
  });

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive-primary">Failed to load courses</p>
      </div>
    );
  }

  const courses = data?.data || [];
  const pagination = data?.pagination || { page: 1, perPage, total: 0, totalPages: 0 };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Course Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No courses found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <Button key={page} variant={page === currentPage ? 'default' : 'outline'} size="sm" onClick={() => handlePageChange(page)} className="min-w-9">
                {page}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages}>
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, pagination.total)} of {pagination.total} courses
      </div>
    </div>
  );
};
