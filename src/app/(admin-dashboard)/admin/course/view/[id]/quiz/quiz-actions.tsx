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
import { deleteQuiz, publishQuiz, unpublishQuiz } from '@/data/admin/quizzes';
import Link from 'next/link';
import type { Quiz } from '@/data/admin/quizzes';

interface QuizActionsProps {
  quiz: Quiz;
  courseId: string;
}

export const QuizActions = ({ quiz, courseId }: QuizActionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteQuiz(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes-list'] });
      setShowDeleteDialog(false);
      toast.success('Quiz deleted successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete quiz';
      toast.error(message);
    },
  });

  const publishQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      return publishQuiz(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes-list'] });
      setShowPublishDialog(false);
      toast.success('Quiz published successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to publish quiz';
      toast.error(message);
    },
  });

  const unpublishQuizMutation = useMutation({
    mutationFn: async (id: string) => {
      return unpublishQuiz(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes-list'] });
      setShowPublishDialog(false);
      toast.success('Quiz unpublished successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to unpublish quiz';
      toast.error(message);
    },
  });

  const handleCopyQuizId = () => {
    navigator.clipboard.writeText(quiz.id);
    toast.success('Quiz ID copied to clipboard');
  };

  const handleDelete = () => {
    toast.promise(deleteQuizMutation.mutateAsync(quiz.id), {
      loading: 'Deleting quiz...',
      success: 'Quiz deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete quiz';
      },
    });
  };

  const handlePublish = () => {
    toast.promise(publishQuizMutation.mutateAsync(quiz.id), {
      loading: 'Publishing quiz...',
      success: 'Quiz published successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to publish quiz';
      },
    });
  };

  const handleUnpublish = () => {
    toast.promise(unpublishQuizMutation.mutateAsync(quiz.id), {
      loading: 'Unpublishing quiz...',
      success: 'Quiz unpublished successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to unpublish quiz';
      },
    });
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/course/view/${courseId}/quiz/${quiz.id}/edit`} className="cursor-pointer flex gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyQuizId} className="flex gap-2">
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!quiz.isPublished ? (
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
            <DialogTitle>Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Quiz:</span> {quiz.title}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Questions:</span> {quiz.questionCount}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-20 cursor-pointer"
              disabled={deleteQuizMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleDelete}
              disabled={deleteQuizMutation.isPending}
            >
              {deleteQuizMutation.isPending ? <Spinner className="size-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish/Unpublish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>
              {quiz.isPublished ? 'Unpublish Quiz' : 'Publish Quiz'}
            </DialogTitle>
            <DialogDescription>
              {quiz.isPublished
                ? 'Are you sure you want to unpublish this quiz? It will no longer be visible to students.'
                : 'Are you sure you want to publish this quiz? It will become visible to students.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Quiz:</span> {quiz.title}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              className="w-20 cursor-pointer"
              disabled={publishQuizMutation.isPending || unpublishQuizMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={quiz.isPublished ? 'destructive' : 'default'}
              className="w-20 cursor-pointer"
              onClick={quiz.isPublished ? handleUnpublish : handlePublish}
              disabled={publishQuizMutation.isPending || unpublishQuizMutation.isPending}
            >
              {publishQuizMutation.isPending || unpublishQuizMutation.isPending ? (
                <Spinner className="size-4" />
              ) : quiz.isPublished ? (
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
