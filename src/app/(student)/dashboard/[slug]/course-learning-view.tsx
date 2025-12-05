'use client';

import { Spinner } from '@/components/ui/spinner';
import { ModuleSidebar } from './module-sidebar';
import { useCourseDetails } from '@/data/public/course-details';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface CourseLearningViewProps {
  slug: string;
}

export const CourseLearningView = ({ slug }: CourseLearningViewProps) => {
  // Fetch course details by slug
  const { data: courseData, isLoading: courseLoading, error: courseError } = useCourseDetails(slug);

  // Get the course ID once loaded
  const courseId = courseData?.data?.id;

  if (courseLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (courseError || !courseData?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive-primary">Failed to load course</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const course = courseData.data;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>
            <div className="min-w-0">
              <h1 className="font-semibold text-lg truncate">{course.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] h-full">
          {/* Left: Course Overview */}
          <div className="overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Select a Lesson</h3>
                  <p className="text-muted-foreground">
                    Choose a lesson from the sidebar to start learning
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Module Sidebar */}
          <div className="border-l bg-muted/30 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Course Content</h3>
              {courseId && (
                <ModuleSidebar
                  courseId={courseId}
                  courseSlug={slug}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
