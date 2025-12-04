'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createModule, updateModule } from '@/data/admin/modules';
import type { Module, CreateModulePayload, UpdateModulePayload } from '@/data/admin/modules';

interface ModuleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module: Module | null;
  courseId: string;
  nextOrder: number;
}

export const ModuleFormDialog = ({
  open,
  onOpenChange,
  module,
  courseId,
  nextOrder,
}: ModuleFormDialogProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // Initialize form data when module changes or dialog opens
  useEffect(() => {
    if (open) {
      if (module) {
        setTitle(module.title);
        setDescription(module.description || '');
        setIsPublished(module.isPublished);
      } else {
        setTitle('');
        setDescription('');
        setIsPublished(false);
      }
      setErrors({});
    }
  }, [open, module]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateModulePayload) => {
      return createModule(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      toast.success('Module created successfully');
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to create module';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateModulePayload) => {
      return updateModule(module!.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      toast.success('Module updated successfully');
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to update module';
      toast.error(message);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be at most 200 characters';
    }

    if (description.length > 1000) {
      newErrors.description = 'Description must be at most 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (module) {
      const payload: UpdateModulePayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        isPublished,
      };
      await updateMutation.mutateAsync(payload);
    } else {
      const payload: CreateModulePayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        course: courseId,
        order: nextOrder,
        isPublished,
      };
      await createMutation.mutateAsync(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {module ? 'Edit Module' : 'Create New Module'}
          </DialogTitle>
          <DialogDescription>
            {module
              ? 'Update module details below'
              : 'Add a new module to this course'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive-primary">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive-primary">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this module..."
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/1000 characters
            </p>
            {errors.description && (
              <p className="text-sm text-destructive-primary">{errors.description}</p>
            )}
          </div>

          {/* Published Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(!!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="published" className="cursor-pointer font-normal">
              Publish module immediately
            </Label>
          </div>

          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  {module ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                module ? 'Update Module' : 'Create Module'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
