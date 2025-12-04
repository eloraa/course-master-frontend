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
import { EllipsisVertical, PencilIcon, Trash2Icon, Copy, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteAssignment, publishAssignment, unpublishAssignment } from '@/data/admin/assignments';
import Link from 'next/link';
import type { Assignment } from '@/data/admin/assignments';

interface AssignmentActionsProps {
  assignment: Assignment;
  courseId: string;
}

export const AssignmentActions = ({ assignment, courseId }: AssignmentActionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteAssignment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments-list'] });
      setShowDeleteDialog(false);
      toast.success('Assignment deleted successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete assignment';
      toast.error(message);
    },
  });

  const publishAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return publishAssignment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments-list'] });
      setShowPublishDialog(false);
      toast.success('Assignment published successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to publish assignment';
      toast.error(message);
    },
  });

  const unpublishAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return unpublishAssignment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments-list'] });
      setShowPublishDialog(false);
      toast.success('Assignment unpublished successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to unpublish assignment';
      toast.error(message);
    },
  });

  const handleCopyAssignmentId = () => {
    navigator.clipboard.writeText(assignment.id);
    toast.success('Assignment ID copied to clipboard');
  };

  const handleDelete = () => {
    toast.promise(deleteAssignmentMutation.mutateAsync(assignment.id), {
      loading: 'Deleting assignment...',
      success: 'Assignment deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete assignment';
      },
    });
  };

  const handlePublish = () => {
    toast.promise(publishAssignmentMutation.mutateAsync(assignment.id), {
      loading: 'Publishing assignment...',
      success: 'Assignment published successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to publish assignment';
      },
    });
  };

  const handleUnpublish = () => {
    toast.promise(unpublishAssignmentMutation.mutateAsync(assignment.id), {
      loading: 'Unpublishing assignment...',
      success: 'Assignment unpublished successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to unpublish assignment';
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
            <Link href={`/admin/course/view/${courseId}/assignments/${assignment.id}/edit`} className="cursor-pointer flex gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/course/view/${courseId}/assignments/${assignment.id}/submissions`} className="cursor-pointer flex gap-2">
              <CheckSquare className="h-4 w-4" />
              Manage Submissions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyAssignmentId} className="flex gap-2">
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!assignment.isPublished ? (
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
            <DialogTitle>Delete Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this assignment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Assignment:</span> {assignment.title}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Submissions:</span> {assignment.submissionCount}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-20 cursor-pointer"
              disabled={deleteAssignmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleDelete}
              disabled={deleteAssignmentMutation.isPending}
            >
              {deleteAssignmentMutation.isPending ? <Spinner className="size-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish/Unpublish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>
              {assignment.isPublished ? 'Unpublish Assignment' : 'Publish Assignment'}
            </DialogTitle>
            <DialogDescription>
              {assignment.isPublished
                ? 'Are you sure you want to unpublish this assignment? It will no longer be visible to students.'
                : 'Are you sure you want to publish this assignment? It will become visible to students.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Assignment:</span> {assignment.title}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              className="w-20 cursor-pointer"
              disabled={publishAssignmentMutation.isPending || unpublishAssignmentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={assignment.isPublished ? 'destructive' : 'default'}
              className="w-20 cursor-pointer"
              onClick={assignment.isPublished ? handleUnpublish : handlePublish}
              disabled={publishAssignmentMutation.isPending || unpublishAssignmentMutation.isPending}
            >
              {publishAssignmentMutation.isPending || unpublishAssignmentMutation.isPending ? (
                <Spinner className="size-4" />
              ) : assignment.isPublished ? (
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
