'use client';

import * as React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVertical, PencilIcon, Trash2Icon, Eye, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { type CourseData, deleteCourse } from '@/data/admin/courses';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

interface CourseActionsProps {
  course: CourseData;
}

export const CourseActions = ({ course }: CourseActionsProps) => {
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const queryClient = useQueryClient();

  const handleCopyCourseId = () => {
    navigator.clipboard.writeText(course.id);
    toast.success('Course ID copied to clipboard');
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCourse(course.id);
      toast.success('Course deleted successfully');
      setDeleteOpen(false);
      setOpen(false);
      // Invalidate the courses list query to refresh the table
      queryClient.invalidateQueries({ queryKey: ['courses-list'] });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete course';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/course/view/${course.id}`} className="cursor-pointer flex gap-2">
              <Eye className="h-4 w-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/course/edit/${course.id}`} className="cursor-pointer flex gap-2">
              <PencilIcon className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyCourseId} className="flex gap-2">
            <Copy className="h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive-primary flex gap-2">
            <Trash2Icon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>Are you sure you want to delete this course? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Course:</span> {course.title}
            </p>
            {course.totalEnrolled > 0 && (
              <p className="text-sm text-destructive">
                <span className="font-semibold">Warning:</span> {course.totalEnrolled} student(s) are enrolled in this course.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Spinner className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
