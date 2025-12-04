'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createBatch, type CreateBatchPayload } from '@/data/admin/batches';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusIcon } from 'lucide-react';

const createBatchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
});

type CreateBatchFormData = z.infer<typeof createBatchSchema>;

interface BatchCreateFilterProps {
  courseId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BatchCreateFilter = ({ courseId, open: externalOpen, onOpenChange }: BatchCreateFilterProps) => {
  const [internalShowCreateDialog, setInternalShowCreateDialog] = React.useState(false);
  const showCreateDialog = externalOpen !== undefined ? externalOpen : internalShowCreateDialog;
  const setShowCreateDialog = onOpenChange || setInternalShowCreateDialog;
  const queryClient = useQueryClient();

  const form = useForm<CreateBatchFormData>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  });

  const createBatchMutation = useMutation({
    mutationFn: async (data: CreateBatchFormData) => {
      const payload: CreateBatchPayload = {
        name: data.name,
        description: data.description,
        course: courseId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };
      return createBatch(payload);
    },
    onSuccess: () => {
      toast.success('Batch created successfully');
      queryClient.invalidateQueries({ queryKey: ['batches-by-course', courseId] });
      setShowCreateDialog(false);
      form.reset();
    },
    onError: (error: unknown) => {
      let message = 'Failed to create batch';
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    },
  });

  const onSubmit = (data: CreateBatchFormData) => {
    createBatchMutation.mutate(data);
  };

  const handleCreateDialogClose = () => {
    setShowCreateDialog(false);
    form.reset();
  };

  return (
    <>
      <Button onClick={() => setShowCreateDialog(true)} size="sm" className="gap-2">
        <PlusIcon className="h-4 w-4" />
        Create Batch
      </Button>

      <Dialog open={showCreateDialog} onOpenChange={handleCreateDialogClose}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
            <DialogDescription>Create a new batch for this course</DialogDescription>
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
                <Button variant="outline" onClick={handleCreateDialogClose} className="w-20 cursor-pointer" type="button" disabled={createBatchMutation.isPending}>
                  Cancel
                </Button>
                <Button type="submit" className="w-20 cursor-pointer" disabled={createBatchMutation.isPending}>
                  {createBatchMutation.isPending ? <Spinner className="size-4" /> : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
