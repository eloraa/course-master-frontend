'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Plus } from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { GripVertical, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleActions } from './module-actions';
import { LessonItem } from './lesson-item';
import { LessonFormDialog } from './lesson-form-dialog';
import { useLessonsList, updateLesson } from '@/data/admin/lessons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Module } from '@/data/admin/modules';
import type { Lesson } from '@/data/admin/lessons';

interface ModuleItemProps {
  module: Module;
  courseId: string;
  index: number;
  isDragging: boolean;
  draggedOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit: (module: Module) => void;
}

export const ModuleItem = React.forwardRef<HTMLDivElement, ModuleItemProps>(
  (
    {
      module,
      courseId,
      isDragging,
      draggedOver,
      onDragStart,
      onDragOver,
      onDragEnd,
      isOpen,
      onOpenChange,
      onEdit,
    },
    ref
  ) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [draggedLessonIndex, setDraggedLessonIndex] = useState<number | null>(null);
    const [draggedLessonOverIndex, setDraggedLessonOverIndex] = useState<number | null>(null);
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    const queryClient = useQueryClient();
    const { data: lessonsData, isLoading: lessonsLoading } = useLessonsList({
      module: module.id,
    });

    useEffect(() => {
      if (lessonsData?.data) {
        const sorted = [...lessonsData.data].sort((a, b) => a.order - b.order);
        setLessons(sorted);
      }
    }, [lessonsData]);

    const updateLessonOrderMutation = useMutation({
      mutationFn: async (lessonsToUpdate: Lesson[]) => {
        await Promise.all(
          lessonsToUpdate.map((lesson, idx) =>
            updateLesson(lesson.id, { order: idx })
          )
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
        toast.success('Lesson order updated successfully');
      },
      onError: () => {
        if (lessonsData?.data) {
          const sorted = [...lessonsData.data].sort((a, b) => a.order - b.order);
          setLessons(sorted);
        }
        toast.error('Failed to update lesson order');
      },
    });

    const handleLessonDragStart = (index: number) => {
      setDraggedLessonIndex(index);
    };

    const handleLessonDragOver = (index: number) => {
      if (draggedLessonIndex === null || draggedLessonIndex === index) return;

      const reordered = [...lessons];
      const [removed] = reordered.splice(draggedLessonIndex, 1);
      reordered.splice(index, 0, removed);

      setLessons(reordered);
      setDraggedLessonIndex(index);
      setDraggedLessonOverIndex(index);
    };

    const handleLessonDragEnd = async () => {
      if (draggedLessonIndex === null) return;

      setDraggedLessonIndex(null);
      setDraggedLessonOverIndex(null);

      await updateLessonOrderMutation.mutateAsync(lessons);
    };

    const handleEditLesson = (lesson: Lesson) => {
      setEditingLesson(lesson);
      setShowLessonForm(true);
    };

    const handleCreateLesson = () => {
      setEditingLesson(null);
      setShowLessonForm(true);
    };

    const handleLessonFormClose = (isOpenForm: boolean) => {
      if (!isOpenForm) {
        setShowLessonForm(false);
        setEditingLesson(null);
      }
    };

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
        <Collapsible open={isOpen} onOpenChange={onOpenChange}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              {/* Drag Handle */}
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Expand Icon */}
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform flex-shrink-0',
                  isOpen && 'rotate-90'
                )}
              />

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{module.title}</h3>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    #{module.order + 1}
                  </Badge>
                  {module.isPublished ? (
                    <Badge variant="default" className="text-xs flex-shrink-0 bg-green-100 text-green-800 hover:bg-green-200">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Draft
                    </Badge>
                  )}
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {module.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {module.lessonCount} lesson{module.lessonCount !== 1 ? 's' : ''}
                  </span>
                  {module.updatedAt && (
                    <span>
                      Updated {new Date(module.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <ModuleActions module={module} onEdit={onEdit} courseId={module.course} />
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <Separator />
            <div className="p-4 space-y-4">
              {/* Lessons Header */}
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">
                  Lessons ({lessons.length})
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCreateLesson}
                  disabled={lessonsLoading}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Lesson
                </Button>
              </div>

              {/* Lessons Loading */}
              {lessonsLoading && (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              )}

              {/* Lessons List */}
              {!lessonsLoading && lessons.length === 0 ? (
                <Card className="border-dashed bg-muted/10">
                  <div className="p-6 text-center">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      No lessons yet. Create one to get started!
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCreateLesson}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create First Lesson
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isDragging={draggedLessonIndex === index}
                      draggedOver={draggedLessonOverIndex === index}
                      onDragStart={() => handleLessonDragStart(index)}
                      onDragOver={() => handleLessonDragOver(index)}
                      onDragEnd={handleLessonDragEnd}
                      onEdit={handleEditLesson}
                    />
                  ))}
                </div>
              )}
            </div>
          </CollapsibleContent>

          {/* Lesson Form Dialog */}
          <LessonFormDialog
            open={showLessonForm}
            onOpenChange={handleLessonFormClose}
            lesson={editingLesson}
            courseId={courseId}
            moduleId={module.id}
            nextOrder={lessons.length}
          />
        </Collapsible>
      </Card>
    );
  }
);

ModuleItem.displayName = 'ModuleItem';
