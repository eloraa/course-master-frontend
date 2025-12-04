'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GripVertical, Clock, FileText, BarChart3, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LessonActions } from './lesson-actions';
import type { Lesson } from '@/data/admin/lessons';

interface LessonItemProps {
  lesson: Lesson;
  isDragging: boolean;
  draggedOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  onEdit: (lesson: Lesson) => void;
}

const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Zap className="h-4 w-4" />;
    case 'article':
      return <FileText className="h-4 w-4" />;
    case 'quiz':
      return <BarChart3 className="h-4 w-4" />;
    case 'assignment':
      return <BarChart3 className="h-4 w-4" />;
    default:
      return <Zap className="h-4 w-4" />;
  }
};

const getLessonTypeColor = (type: string) => {
  switch (type) {
    case 'video':
      return 'bg-blue-100 text-blue-800';
    case 'article':
      return 'bg-purple-100 text-purple-800';
    case 'quiz':
      return 'bg-orange-100 text-orange-800';
    case 'assignment':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const LessonItem = React.forwardRef<HTMLDivElement, LessonItemProps>(
  (
    {
      lesson,
      isDragging,
      draggedOver,
      onDragStart,
      onDragOver,
      onDragEnd,
      onEdit,
    },
    ref
  ) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
      onDragStart(0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      onDragOver(0);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDragEnd();
    };

    return (
      <Card
        ref={ref}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        className={cn('transition-all', {
          'opacity-50 cursor-grabbing': isDragging,
          'border-primary ring-2 ring-primary/20': draggedOver,
          'hover:shadow-md': !isDragging,
        })}
      >
        <div className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
          {/* Drag Handle */}
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />

          {/* Lesson Type Icon */}
          <div className="flex-shrink-0 text-muted-foreground">
            {getLessonIcon(lesson.type)}
          </div>

          {/* Lesson Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm truncate">{lesson.title}</h4>
              <Badge variant="outline" className="text-xs flex-shrink-0">
                #{lesson.order + 1}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs flex-shrink-0', getLessonTypeColor(lesson.type))}
              >
                <span className="capitalize">{lesson.type}</span>
              </Badge>
              {lesson.isPublished ? (
                <Badge
                  variant="default"
                  className="text-xs flex-shrink-0 bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Published
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  Draft
                </Badge>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              {lesson.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} min
                </span>
              )}
              {lesson.updatedAt && (
                <span>Updated {new Date(lesson.updatedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0">
            <LessonActions lesson={lesson} onEdit={onEdit} />
          </div>
        </div>
      </Card>
    );
  }
);

LessonItem.displayName = 'LessonItem';
