'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, PencilIcon, Trash2Icon, Eye, Copy, Globe, Link as LinkIcon, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { type CourseData, type CourseVisibility, COURSE_VISIBILITY_OPTIONS, deleteCourse, publishCourse, unpublishCourse, updateCourseVisibility } from '@/data/admin/courses';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CourseActionsProps {
  course: CourseData;
}

export const CourseActions = ({ course }: CourseActionsProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showPublishDialog, setShowPublishDialog] = React.useState(false);
  const [showUnpublishDialog, setShowUnpublishDialog] = React.useState(false);
  const queryClient = useQueryClient();

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-list'] });
      setShowDeleteDialog(false);
    },
  });

  const publishCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return publishCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-list'] });
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
      setShowPublishDialog(false);
    },
  });

  const unpublishCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return unpublishCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-list'] });
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
      setShowUnpublishDialog(false);
    },
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: async ({ id, visibility }: { id: string; visibility: CourseVisibility }) => {
      return updateCourseVisibility(id, visibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses-list'] });
      queryClient.invalidateQueries({ queryKey: ['course', course.id] });
    },
  });

  const handleCopyCourseId = () => {
    navigator.clipboard.writeText(course.id);
    toast.success('Course ID copied to clipboard');
  };

  const handleDelete = () => {
    if (Array.isArray(course)) return;
    toast.promise(deleteCourseMutation.mutateAsync(course.id), {
      loading: 'Deleting course...',
      success: 'Course deleted successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to delete course';
      },
    });
  };

  const handlePublish = () => {
    if (Array.isArray(course)) return;
    toast.promise(publishCourseMutation.mutateAsync(course.id), {
      loading: 'Publishing course...',
      success: 'Course published successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to publish course';
      },
    });
  };

  const handleUnpublish = () => {
    if (Array.isArray(course)) return;
    toast.promise(unpublishCourseMutation.mutateAsync(course.id), {
      loading: 'Unpublishing course...',
      success: 'Course unpublished successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to unpublish course';
      },
    });
  };

  const handleVisibilityChange = (visibility: CourseVisibility) => {
    if (Array.isArray(course)) return;
    toast.promise(updateVisibilityMutation.mutateAsync({ id: course.id, visibility }), {
      loading: 'Updating course visibility...',
      success: 'Course visibility updated successfully',
      error: (err: unknown) => {
        if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
          return (err as { message: string }).message;
        }
        return 'Failed to update course visibility';
      },
    });
  };

  const getVisibilityIcon = (visibility: CourseVisibility) => {
    switch (visibility) {
      case 'public':
        return <Globe className="h-4 w-4" />;
      case 'unlisted':
        return <LinkIcon className="h-4 w-4" />;
      case 'private':
        return <Lock className="h-4 w-4" />;
    }
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
          {!course.isPublished ? (
            <DropdownMenuItem onClick={() => setShowPublishDialog(true)} className="flex gap-2">
              <Globe className="h-4 w-4" />
              Publish
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {getVisibilityIcon(course.visibility)}
                  Visibility
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent sideOffset={0}>
                    {COURSE_VISIBILITY_OPTIONS.map((visibility) => (
                      <DropdownMenuCheckboxItem
                        key={visibility}
                        className="pr-16"
                        onClick={() => handleVisibilityChange(visibility)}
                        checked={course.visibility === visibility}
                      >
                        {getVisibilityIcon(visibility)}
                        <span className="ml-2 capitalize">{visibility}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => setShowUnpublishDialog(true)} className="flex gap-2">
                <Globe className="h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive-primary-primary-primary flex gap-2">
            <Trash2Icon className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Course Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>Are you sure you want to delete this course? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Course:</span> {course.title}
            </p>
            {course.totalEnrolled > 0 && (
              <p className="text-sm text-destructive-primary-primary">
                <span className="font-semibold">Warning:</span> {course.totalEnrolled} student(s) are enrolled in this course.
              </p>
            )}
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="w-20 cursor-pointer"
              disabled={deleteCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleDelete}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? <Spinner className="size-4" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Course Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Publish Course</DialogTitle>
            <DialogDescription>Are you sure you want to publish this course? It will become visible to students.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Course:</span> {course.title}
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowPublishDialog(false)}
              className="w-20 cursor-pointer"
              disabled={publishCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-20 cursor-pointer"
              onClick={handlePublish}
              disabled={publishCourseMutation.isPending}
            >
              {publishCourseMutation.isPending ? <Spinner className="size-4" /> : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unpublish Course Dialog */}
      <Dialog open={showUnpublishDialog} onOpenChange={setShowUnpublishDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Unpublish Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to unpublish this course? It will no longer be visible to students.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Course:</span> {course.title}
            </p>
            {course.totalEnrolled > 0 && (
              <p className="text-sm text-destructive-primary-primary">
                <span className="font-semibold">Warning:</span> {course.totalEnrolled} student(s) are currently enrolled.
              </p>
            )}
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowUnpublishDialog(false)}
              className="w-20 cursor-pointer"
              disabled={unpublishCourseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-20 cursor-pointer"
              onClick={handleUnpublish}
              disabled={unpublishCourseMutation.isPending}
            >
              {unpublishCourseMutation.isPending ? <Spinner className="size-4" /> : 'Unpublish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};
