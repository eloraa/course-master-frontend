'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { EllipsisVertical, PencilIcon, Trash2Icon, Copy, Eye, EyeOff } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteLesson, updateLesson } from '@/data/admin/lessons';
import type { Lesson } from '@/data/admin/lessons';

interface LessonActionsProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
}

export const LessonActions = ({ lesson, onEdit }: LessonActionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteModule = lesson.module;

  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteLesson(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
      setShowDeleteDialog(false);
      toast.success('Lesson deleted successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete lesson';
      toast.error(message);
    },
  });

  const publishModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return updateLesson(id, { isPublished: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
      setShowPublishDialog(false);
      toast.success('Lesson published successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to publish lesson';
      toast.error(message);
    },
  });

  const unpublishModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return updateLesson(id, { isPublished: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
      setShowPublishDialog(false);
      toast.success('Lesson unpublished successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to unpublish lesson';
      toast.error(message);
    },
  });

  const handleCopyLessonId = () => {
    navigator.clipboard.writeText(lesson.id);
    toast.success('Lesson ID copied to clipboard');
  };

  const handleDelete = () => {
    toast.promise(deleteModuleMutation.mutateAsync(lesson.id), {
      loading: 'Deleting lesson...',
      success: 'Lesson deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete lesson';
      },
    });
  };

  const handlePublish = () => {
    toast.promise(publishModuleMutation.mutateAsync(lesson.id), {
      loading: 'Publishing lesson...',
      success: 'Lesson published successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to publish lesson';
      },
    });
  };

  const handleUnpublish = () => {
    toast.promise(unpublishModuleMutation.mutateAsync(lesson.id), {
      loading: 'Unpublishing lesson...',
      success: 'Lesson unpublished successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to unpublish lesson';
      },
    });
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" size="icon">
            <span className="sr-only">Open menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onEdit(lesson);
              setIsOpen(false);
            }}
            className="flex gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLessonId} className="flex gap-2">
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!lesson.isPublished ? (
            <DropdownMenuItem
              onClick={() => {
                setShowPublishDialog(true);
                setIsOpen(false);
              }}
              className="flex gap-2"
            >
              <Eye className="h-4 w-4" />
              Publish
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                setShowPublishDialog(true);
                setIsOpen(false);
              }}
              className="flex gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
              setIsOpen(false);
            }}
            className="text-destructive-primary-primary flex gap-2"
          >
            <Trash2Icon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Delete Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lesson? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Lesson:</span> {lesson.title}
            </p>
            <p className="text-sm text-muted-foreground">
              Type: <span className="capitalize font-medium">{lesson.type}</span>
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-20 cursor-pointer"
              disabled={deleteModuleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleDelete}
              disabled={deleteModuleMutation.isPending}
            >
              {deleteModuleMutation.isPending ? <Spinner className="size-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish/Unpublish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>
              {lesson.isPublished ? 'Unpublish Lesson' : 'Publish Lesson'}
            </DialogTitle>
            <DialogDescription>
              {lesson.isPublished
                ? 'Are you sure you want to unpublish this lesson? It will no longer be visible to students.'
                : 'Are you sure you want to publish this lesson? It will become visible to students.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Lesson:</span> {lesson.title}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              className="w-20 cursor-pointer"
              disabled={publishModuleMutation.isPending || unpublishModuleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={lesson.isPublished ? 'destructive' : 'default'}
              className="w-20 cursor-pointer"
              onClick={lesson.isPublished ? handleUnpublish : handlePublish}
              disabled={publishModuleMutation.isPending || unpublishModuleMutation.isPending}
            >
              {publishModuleMutation.isPending || unpublishModuleMutation.isPending ? (
                <Spinner className="size-4" />
              ) : lesson.isPublished ? (
                'Unpublish'
              ) : (
                'Publish'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
