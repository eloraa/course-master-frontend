'use client';

import { Spinner } from '@/components/ui/spinner';
import { ModuleSidebar } from '../module-sidebar';
import { LessonContent } from '../lesson-content';
import { useCourseDetails } from '@/data/public/course-details';
import { useLesson } from '@/data/student/course-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface LessonViewProps {
  slug: string;
  lessonId: string;
}

export const LessonView = ({ slug, lessonId }: LessonViewProps) => {
  // Fetch course details by slug
  const { data: courseData, isLoading: courseLoading, error: courseError } = useCourseDetails(slug);

  // Get the course ID once loaded
  const courseId = courseData?.data?.id;

  // Fetch the lesson
  const { data: lessonData, isLoading: lessonLoading } = useLesson(courseId || '', lessonId);

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
  const currentLesson = lessonData?.data;

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
          {/* Left: Video/Content Area */}
          <div className="overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {lessonLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-6" />
                </div>
              ) : currentLesson ? (
                <div className="flex flex-col gap-6">
                  {/* Lesson Title */}
                  <div>
                    <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                    {currentLesson.duration && <p className="text-sm text-muted-foreground mt-1">Duration: {currentLesson.duration} minutes</p>}
                  </div>

                  {/* Lesson Content */}
                  <LessonContent lesson={currentLesson} courseId={courseId || ''} />

                  {/* Resources */}
                  {currentLesson.resources && currentLesson.resources.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {currentLesson.resources.map((resource, index) => (
                            <li key={resource._id || index}>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                                {resource.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-destructive-primary">Failed to load lesson</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Module Sidebar */}
          <div className="border-l bg-muted/30 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Course Content</h3>
              {courseId && <ModuleSidebar courseId={courseId} courseSlug={slug} currentLessonId={lessonId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
