'use client';

import { VideoPlayer } from './video-player';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock } from 'lucide-react';
import { useCompleteLesson } from '@/data/student/course-content';
import { toast } from 'sonner';
import type { Lesson } from '@/data/student/course-content';

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
}

export const LessonContent = ({ lesson, courseId }: LessonContentProps) => {
  const completeLessonMutation = useCompleteLesson();

  const handleCompleteLesson = async () => {
    try {
      await completeLessonMutation.mutateAsync({
        courseId,
        lessonId: lesson.id,
      });
      toast.success('Lesson marked as complete!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark lesson as complete';
      toast.error(message);
    }
  };

  // Handle video lessons
  if (lesson.type === 'video') {
    return (
      <div className="flex flex-col gap-6">
        <VideoPlayer url={lesson.content} title={lesson.title} />
        {!lesson.completed && (
          <div className="flex justify-end">
            <Button
              onClick={handleCompleteLesson}
              disabled={completeLessonMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completeLessonMutation.isPending ? 'Completing...' : 'Mark as Complete'}
            </Button>
          </div>
        )}
        {lesson.completed && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle article lessons with markdown
  if (lesson.type === 'article') {
    return (
      <div className="flex flex-col gap-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MarkdownPreview content={lesson.content} />
        </div>
        {!lesson.completed && (
          <div className="flex justify-end">
            <Button
              onClick={handleCompleteLesson}
              disabled={completeLessonMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completeLessonMutation.isPending ? 'Completing...' : 'Mark as Complete'}
            </Button>
          </div>
        )}
        {lesson.completed && (
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle quiz lessons (placeholder)
  if (lesson.type === 'quiz') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-muted/30">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Quiz Lesson</h3>
        <p className="text-muted-foreground text-center">
          Quiz functionality will be available soon. Navigate to the dedicated quiz page.
        </p>
      </div>
    );
  }

  // Handle assignment lessons (placeholder)
  if (lesson.type === 'assignment') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-muted/30">
        <Lock className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Assignment Lesson</h3>
        <p className="text-muted-foreground text-center">
          Assignment functionality will be available soon. Navigate to the dedicated assignment page.
        </p>
      </div>
    );
  }

  return null;
};
