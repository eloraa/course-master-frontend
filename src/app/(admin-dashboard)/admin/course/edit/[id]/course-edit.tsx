'use client';

import { CourseForm } from '../../course-form';
import { useCourseById } from '@/data/admin/courses';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';

interface CourseEditProps {
  courseId: string;
}

export const CourseEdit = ({ courseId }: CourseEditProps) => {
  const { data: course, isLoading: courseLoading, error: courseError } = useCourseById(courseId);

  if (courseLoading) return <DataTableSkeleton />;

  if (courseError || !course?.data) return <SomethingWentWrong />;

  return <CourseForm course={course.data} />;
};
