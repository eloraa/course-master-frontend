'use client';

import { useMyCourses } from '@/data/student/enrollment';
import { Spinner } from '@/components/ui/spinner';
import { EnrolledCourseCard } from './enrolled-course-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const EnrolledCoursesList = () => {
  const { data, isLoading, error } = useMyCourses();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load your courses</p>
      </div>
    );
  }

  const enrollments = data?.data || [];

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No Courses Yet</h3>
            <p className="text-muted-foreground">You haven&apos;t enrolled in any courses. Start learning by browsing our course catalog.</p>
          </div>
          <Button asChild>
            <Link href="/">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {enrollments.map(enrollment => (
          <EnrolledCourseCard key={enrollment.course.id} enrollment={enrollment} />
        ))}
      </div>

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} enrolled
      </div>
    </div>
  );
};
