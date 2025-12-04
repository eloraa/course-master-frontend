'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Trash2Icon, PencilIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBatchById, updateBatch, deleteBatch, type BatchData } from '@/data/admin/batches';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const editBatchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
});

type EditBatchFormData = z.infer<typeof editBatchSchema>;

interface BatchDetailsDialogProps {
  batchId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
}

export const BatchDetailsDialog = ({ batchId, open, onOpenChange, courseId }: BatchDetailsDialogProps) => {
  const { data: batchData, isLoading: batchLoading } = useBatchById(batchId || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const batch = batchData?.data;

  const form = useForm<EditBatchFormData>({
    resolver: zodResolver(editBatchSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  });

  // Update form when batch data loads
  React.useEffect(() => {
    if (batch && isEditing) {
      form.reset({
        name: batch.name,
        description: batch.description || '',
        startDate: new Date(batch.startDate).toISOString().split('T')[0],
        endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [batch, isEditing, form]);

  const updateBatchMutation = useMutation({
    mutationFn: async (data: EditBatchFormData) => {
      if (!batchId) return;
      return updateBatch(batchId, {
        name: data.name,
        description: data.description,
      });
    },
    onSuccess: () => {
      toast.success('Batch updated successfully');
      queryClient.invalidateQueries({ queryKey: ['batches-by-course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      let message = 'Failed to update batch';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: async () => {
      if (!batchId) return;
      return deleteBatch(batchId);
    },
    onSuccess: () => {
      toast.success('Batch deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['batches-by-course', courseId] });
      setShowDeleteDialog(false);
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      let message = 'Failed to delete batch';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: EditBatchFormData) => {
    updateBatchMutation.mutate(data);
  };

  const handleDelete = () => {
    toast.promise(deleteBatchMutation.mutateAsync(), {
      loading: 'Deleting batch...',
      success: 'Batch deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete batch';
      },
    });
  };

  if (!batch && batchLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-md pt-6">
          <div className="flex items-center justify-center py-8">
            <Spinner className="h-6 w-6" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!batch) {
    return null;
  }

  return (
    <>
      <Dialog open={open && !isEditing} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>{batch.name}</DialogTitle>
            <DialogDescription>{batch.description || 'No description'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Start Date</p>
              <p className="text-sm font-medium">
                {new Date(batch.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {batch.endDate && (
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-medium">
                  {new Date(batch.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-20 cursor-pointer"
              disabled={deleteBatchMutation.isPending}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              className="w-20 cursor-pointer"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Edit Batch</DialogTitle>
            <DialogDescription>Update batch details</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., January 2024 Cohort" className="bg-transparent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Batch description" className="bg-transparent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-transparent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="items-start flex-col gap-2 border-b-0 py-0">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" className="bg-transparent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="w-20 cursor-pointer"
                  type="button"
                  disabled={updateBatchMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-20 cursor-pointer"
                  disabled={updateBatchMutation.isPending}
                >
                  {updateBatchMutation.isPending ? <Spinner className="size-4" /> : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Delete Batch</DialogTitle>
            <DialogDescription>Are you sure you want to delete this batch? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Batch:</span> {batch.name}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-20 cursor-pointer"
              disabled={deleteBatchMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleDelete}
              disabled={deleteBatchMutation.isPending}
            >
              {deleteBatchMutation.isPending ? <Spinner className="size-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
