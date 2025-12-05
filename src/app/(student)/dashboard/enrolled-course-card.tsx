'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { EnrollmentData } from '@/data/student/enrollment';

interface EnrolledCourseCardProps {
  enrollment: EnrollmentData;
}

export const EnrolledCourseCard = ({ enrollment }: EnrolledCourseCardProps) => {
  const { course, progress } = enrollment;
  console.log(course);

  return (
    <Link href={`/dashboard/${course.slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
            {course.thumbnailUrl ? (
              <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            {progress && progress.percentage > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                <Progress value={progress.percentage} className="h-1" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base line-clamp-2">{course.title}</h3>
            {course.level && (
              <Badge variant="outline" className="w-fit text-xs">
                {course.level}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{course.shortDescription}</p>

          {progress && (
            <div className="flex flex-col gap-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{progress.percentage}%</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {progress.completedLessons} lessons completed
                </div>
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration} min
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <PlayCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Continue Learning</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
