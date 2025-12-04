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
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLesson, updateLesson } from '@/data/admin/lessons';
import { CustomMarkdownEditor } from '@/components/markdown/custom-markdown-editor';
import { QuizPopover } from './quiz-popover';
import { X } from 'lucide-react';
import type { Lesson, CreateLessonPayload, UpdateLessonPayload } from '@/data/admin/lessons';

interface LessonFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
  courseId: string;
  moduleId: string;
  nextOrder: number;
}

type LessonType = 'video' | 'article' | 'quiz' | 'assignment';

export const LessonFormDialog = ({
  open,
  onOpenChange,
  lesson,
  courseId,
  moduleId,
  nextOrder,
}: LessonFormDialogProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<LessonType>('video');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  // Initialize form data when lesson changes or dialog opens
  useEffect(() => {
    if (open) {
      if (lesson) {
        setTitle(lesson.title);
        setType(lesson.type);
        setContent(lesson.content);
        setDuration(lesson.duration?.toString() || '');
        setIsPublished(lesson.isPublished);
        if (lesson.type === 'quiz') {
          setSelectedQuizId(lesson.content);
          setSelectedQuizTitle(lesson.content); // Will be replaced with actual title when selected
        } else {
          setSelectedQuizId('');
          setSelectedQuizTitle('');
        }
      } else {
        setTitle('');
        setType('video');
        setContent('');
        setDuration('');
        setIsPublished(false);
        setSelectedQuizId('');
        setSelectedQuizTitle('');
      }
      setErrors({});
    }
  }, [open, lesson]);

  const createMutation = useMutation({
    mutationFn: async (payload: CreateLessonPayload) => {
      return createLesson(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
      toast.success('Lesson created successfully');
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to create lesson';
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateLessonPayload) => {
      return updateLesson(lesson!.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons-list'] });
      toast.success('Lesson updated successfully');
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Failed to update lesson';
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

    if (type === 'quiz') {
      if (!selectedQuizId) {
        newErrors.content = 'Please select a quiz';
      }
    } else if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (type === 'video' && duration) {
      const durationNum = parseInt(duration, 10);
      if (isNaN(durationNum) || durationNum <= 0) {
        newErrors.duration = 'Duration must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (lesson) {
      const payload: UpdateLessonPayload = {
        title: title.trim(),
        type,
        content: type === 'quiz' ? selectedQuizId : content.trim(),
        duration: type === 'video' && duration ? parseInt(duration, 10) : undefined,
        isPublished,
      };
      await updateMutation.mutateAsync(payload);
    } else {
      const payload: CreateLessonPayload = {
        title: title.trim(),
        course: courseId,
        module: moduleId,
        type,
        content: type === 'quiz' ? selectedQuizId : content.trim(),
        duration: type === 'video' && duration ? parseInt(duration, 10) : undefined,
        order: nextOrder,
        isPublished,
      };
      await createMutation.mutateAsync(payload);
    }
  };

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
    // Note: We should ideally fetch the quiz title from the API, but for now we'll use the ID
    setSelectedQuizTitle(quizId);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? 'Edit Lesson' : 'Create New Lesson'}
          </DialogTitle>
          <DialogDescription>
            {lesson
              ? 'Update lesson details below'
              : 'Add a new lesson to this module'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Tab */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
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

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  Lesson Type <span className="text-destructive-primary">*</span>
                </Label>
                <Select value={type} onValueChange={(value) => setType(value as LessonType)} disabled={isSubmitting}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration (for video) */}
              {type === 'video' && (
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 25"
                    disabled={isSubmitting}
                    min="1"
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive-primary">{errors.duration}</p>
                  )}
                </div>
              )}

              {/* Published Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={isPublished}
                  onCheckedChange={(checked) => setIsPublished(!!checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="published" className="cursor-pointer font-normal">
                  Publish lesson immediately
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">
                  {type === 'article' ? 'Article Content (Markdown)' : type === 'quiz' ? 'Select Quiz' : 'Content URL/Reference'} <span className="text-destructive-primary">*</span>
                </Label>
                {type === 'article' ? (
                  <>
                    <CustomMarkdownEditor
                      value={content}
                      onChange={setContent}
                      placeholder="Write your article content in markdown..."
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      Supports markdown formatting for rich text content
                    </p>
                  </>
                ) : type === 'quiz' ? (
                  <div className="space-y-3">
                    <QuizPopover
                      courseId={courseId}
                      moduleId={moduleId}
                      onSelect={handleQuizSelect}
                    />
                    {selectedQuizId && (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <span className="text-sm font-medium">{selectedQuizTitle}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuizId('');
                            setSelectedQuizTitle('');
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      type === 'video'
                        ? 'e.g., https://example.com/video.mp4'
                        : 'Assignment ID'
                    }
                    disabled={isSubmitting}
                  />
                )}
                {errors.content && (
                  <p className="text-sm text-destructive-primary">{errors.content}</p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold text-sm mb-2">Content Guidelines:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {type === 'video' && (
                    <>
                      <li>• Enter video URL (YouTube, Vimeo, or direct MP4)</li>
                      <li>• Duration should be realistic for video length</li>
                    </>
                  )}
                  {type === 'article' && (
                    <>
                      <li>• Use markdown for formatting (headings, lists, code blocks)</li>
                      <li>• Supports **bold**, *italic*, `code`, and more</li>
                    </>
                  )}
                  {type === 'quiz' && (
                    <>
                      <li>• Select an existing quiz from the popover</li>
                      <li>• Create new quizzes from the "Manage Quizzes" page</li>
                    </>
                  )}
                  {type === 'assignment' && <li>• Paste the Assignment ID from the assignment creation page</li>}
                </ul>
              </div>
            </TabsContent>
          </Tabs>

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
                  {lesson ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                lesson ? 'Update Lesson' : 'Create Lesson'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
