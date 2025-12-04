'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Users, Star, Calendar, Tag, Globe, DollarSign } from 'lucide-react';
import { useCourseById } from '@/data/admin/courses';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CourseViewProps {
  courseId: string;
}
const getLevelColor = (level: string | undefined) => {
  if (!level) return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getPublishStatusColor = (isPublished: boolean) => {
  return isPublished ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
};

const formatLevel = (level: string | undefined) => {
  if (!level) return '-';
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export const CourseView = ({ courseId }: CourseViewProps) => {
  const { data, isLoading, error } = useCourseById(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive-primary">Failed to load course details</p>
        <Button asChild variant="outline">
          <Link href="/admin/course">Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const course = data.data;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/course">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground text-sm">{course.slug}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/course/edit/${course.id}`}>Edit Course</Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Short Description</h3>
                <p className="text-sm text-muted-foreground">{course.shortDescription || '-'}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Full Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{course.fullDescription || '-'}</p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status & Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={cn('text-xs', getPublishStatusColor(course.isPublished))}>{course.isPublished ? 'Published' : 'Draft'}</Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{course.category || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Level</p>
                    <Badge variant="outline" className={cn('text-xs', getLevelColor(course.level))}>
                      {formatLevel(course.level)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="text-sm font-medium">{course.language || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">{course.currency}</span>
                <span className="text-2xl font-bold">{course.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Modules</span>
                </div>
                <span className="font-medium">{course.moduleStats?.totalModules || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Lessons</span>
                </div>
                <span className="font-medium">{course.moduleStats?.totalLessons || 0}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Enrolled</span>
                </div>
                <span className="font-medium">{course.totalEnrolled}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-muted-foreground">Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{course.ratingAverage.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({course.ratingCount})</span>
                </div>
              </div>

              {course.duration > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.duration} hours</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {new Date(course.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {course.updatedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(course.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Media Section */}
      {(course.thumbnailUrl || course.promoVideoUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.thumbnailUrl && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Thumbnail</h3>
                <Image fill src={course.thumbnailUrl} alt="Thumbnail" className="w-full max-w-md h-auto rounded-lg border static!" />
              </div>
            )}

            {course.promoVideoUrl && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Promo Video</h3>
                <p className="text-sm text-muted-foreground break-all">{course.promoVideoUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
