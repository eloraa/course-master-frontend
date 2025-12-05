'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, BookOpen } from 'lucide-react';
import type { PublicCourse } from '@/data/public/courses';

interface CourseCardProps extends PublicCourse {}

export const CourseCard = ({
  id,
  title,
  slug,
  shortDescription,
  thumbnailUrl,
  category,
  price,
  currency,
  ratingAverage,
  ratingCount,
  moduleStats,
}: CourseCardProps) => {
  return (
    <Link href={`/course/${slug}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base line-clamp-2 flex-1">{title}</h3>
            </div>
            <Badge variant="outline" className="w-fit text-xs">
              {category}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-0.5">
              {ratingAverage > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{ratingAverage.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({ratingCount})</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No ratings yet</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              {moduleStats.totalLessons}
            </div>
          </div>

          <div className="flex items-baseline gap-2 pt-2 border-t">
            <span className="text-lg font-bold">
              {currency} {price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
