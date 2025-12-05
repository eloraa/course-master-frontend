'use client';

import { useCourseDetails } from '@/data/public/course-details';
import { Spinner } from '@/components/ui/spinner';
import { Star, BookOpen, Clock, Gauge, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnrollButton } from './enroll-button';
import Image from 'next/image';

interface CourseDetailsViewProps {
  slug: string;
}

export const CourseDetailsView = ({ slug }: CourseDetailsViewProps) => {
  const { data, isLoading, error } = useCourseDetails(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load course details</p>
      </div>
    );
  }

  const course = data.data;

  const courseDetails = [
    {
      icon: Globe,
      label: 'Language',
      value: course.language,
    },
    {
      icon: BookOpen,
      label: 'Course Type',
      value: course.courseType,
    },
    {
      icon: Clock,
      label: 'Duration',
      value: course.duration ? `${course.duration} hours` : 'Self-paced',
    },
    {
      icon: Gauge,
      label: 'Level',
      value: course.level || 'All Levels',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Thumbnail */}
      {course.thumbnailUrl && (
        <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden bg-muted">
          <Image fill src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover static!" />
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.shortDescription}</p>

            {/* Course Meta */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {course.ratingAverage > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.ratingAverage.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({course.ratingCount} ratings)</span>
                </div>
              )}
              <span className="text-sm text-muted-foreground">{course.totalEnrolled.toLocaleString()} enrolled</span>
            </div>
          </div>

          {/* Video/Promo Section */}
          {course.promoVideoUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                width="100%"
                height="100%"
                src={course.promoVideoUrl}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Course Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">About This Course</h2>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{course.fullDescription}</p>
            </div>
          </section>

          {/* What You'll Learn */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">What You&apos;ll Learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">Master the fundamentals and core concepts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">Build real-world projects</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">Get hands-on experience</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-muted-foreground">Advance your career</span>
              </li>
            </ul>
          </section>

          {/* Course Requirements */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Requirements</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Basic understanding of the subject</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Access to a computer with internet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Willingness to practice and learn</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="flex flex-col gap-4 sticky top-20">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {course.currency} {course.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <EnrollButton courseId={course.id} price={course.price} currency={course.currency} />
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {courseDetails.map(detail => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs text-muted-foreground">{detail.label}</p>
                        <p className="text-sm font-medium">{detail.value}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Rating Card */}
            {course.ratingAverage > 0 && (
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold">{course.ratingAverage.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{course.ratingCount} ratings</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Module Stats */}
            <Card>
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Modules</span>
                  <span className="text-sm font-semibold">{course.moduleStats.totalModules}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons</span>
                  <span className="text-sm font-semibold">{course.moduleStats.totalLessons}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Enrolled</span>
                  <span className="text-sm font-semibold">{course.totalEnrolled.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
