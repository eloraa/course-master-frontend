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
import { EllipsisVertical, PencilIcon, Trash2Icon, Copy, Globe } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteModule, updateModule } from '@/data/admin/modules';
import type { Module } from '@/data/admin/modules';

interface ModuleActionsProps {
  module: Module;
  courseId: string;
  onEdit: (module: Module) => void;
}

export const ModuleActions = ({ module, courseId, onEdit }: ModuleActionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const queryClient = useQueryClient();

  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteModule(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      setShowDeleteDialog(false);
      toast.success('Module deleted successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to delete module';
      toast.error(message);
    },
  });

  const publishModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return updateModule(id, { isPublished: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      setShowPublishDialog(false);
      toast.success('Module published successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to publish module';
      toast.error(message);
    },
  });

  const unpublishModuleMutation = useMutation({
    mutationFn: async (id: string) => {
      return updateModule(id, { isPublished: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      setShowPublishDialog(false);
      toast.success('Module unpublished successfully');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to unpublish module';
      toast.error(message);
    },
  });

  const handleCopyModuleId = () => {
    navigator.clipboard.writeText(module.id);
    toast.success('Module ID copied to clipboard');
  };

  const handleDelete = () => {
    toast.promise(deleteModuleMutation.mutateAsync(module.id), {
      loading: 'Deleting module...',
      success: 'Module deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete module';
      },
    });
  };

  const handlePublish = () => {
    toast.promise(publishModuleMutation.mutateAsync(module.id), {
      loading: 'Publishing module...',
      success: 'Module published successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to publish module';
      },
    });
  };

  const handleUnpublish = () => {
    toast.promise(unpublishModuleMutation.mutateAsync(module.id), {
      loading: 'Unpublishing module...',
      success: 'Module unpublished successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to unpublish module';
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
          <DropdownMenuItem
            onClick={() => {
              onEdit(module);
              setIsOpen(false);
            }}
            className="flex gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyModuleId} className="flex gap-2">
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!module.isPublished ? (
            <DropdownMenuItem
              onClick={() => {
                setShowPublishDialog(true);
                setIsOpen(false);
              }}
              className="flex gap-2"
            >
              <Globe className="h-4 w-4" />
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
              <Globe className="h-4 w-4" />
              Unpublish
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
              setIsOpen(false);
            }}
            className="text-destructive-primary flex gap-2"
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
            <DialogTitle>Delete Module</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this module? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Module:</span> {module.title}
            </p>
            {module.lessonCount > 0 && (
              <p className="text-sm text-destructive">
                <span className="font-semibold">Warning:</span> This module contains {module.lessonCount} lesson{module.lessonCount !== 1 ? 's' : ''} that will also be deleted.
              </p>
            )}
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
              {module.isPublished ? 'Unpublish Module' : 'Publish Module'}
            </DialogTitle>
            <DialogDescription>
              {module.isPublished
                ? 'Are you sure you want to unpublish this module? It will no longer be visible to students.'
                : 'Are you sure you want to publish this module? It will become visible to students.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Module:</span> {module.title}
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
              variant={module.isPublished ? 'destructive' : 'default'}
              className="w-20 cursor-pointer"
              onClick={module.isPublished ? handleUnpublish : handlePublish}
              disabled={publishModuleMutation.isPending || unpublishModuleMutation.isPending}
            >
              {publishModuleMutation.isPending || unpublishModuleMutation.isPending ? (
                <Spinner className="size-4" />
              ) : module.isPublished ? (
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
