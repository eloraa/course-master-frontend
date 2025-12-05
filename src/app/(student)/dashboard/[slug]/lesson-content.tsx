'use client';

import { VideoPlayer } from './video-player';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { QuizViewer } from './quiz-viewer';
import { QuizResults } from './quiz-results';
import { AssignmentViewer } from './assignment-viewer';
import { AssignmentResults } from './assignment-results';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, Lock } from 'lucide-react';
import { useCompleteLesson, useQuiz, useSubmitQuiz, useAssignment, useSubmitAssignment } from '@/data/student/course-content';
import { toast } from 'sonner';
import type { Lesson } from '@/data/student/course-content';

interface LessonContentProps {
  lesson: Lesson;
  courseId: string;
}

export const LessonContent = ({ lesson, courseId }: LessonContentProps) => {
  const completeLessonMutation = useCompleteLesson();
  const submitQuizMutation = useSubmitQuiz();
  const submitAssignmentMutation = useSubmitAssignment();

  // For quiz lessons, content field contains the quiz ID
  const isQuizLesson = lesson.type === 'quiz';
  const quizId = isQuizLesson ? lesson.content : '';
  const { data: quizData, isLoading: quizLoading } = useQuiz(courseId, quizId, isQuizLesson);

  // For assignment lessons, content field contains the assignment ID
  const isAssignmentLesson = lesson.type === 'assignment';
  const assignmentId = isAssignmentLesson ? lesson.content : '';
  const { data: assignmentData, isLoading: assignmentLoading } = useAssignment(courseId, assignmentId, isAssignmentLesson);

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

  const handleQuizSubmit = async (answers: Record<string, string>, timeTaken: number) => {
    try {
      await submitQuizMutation.mutateAsync({
        courseId,
        quizId,
        answers,
        timeTaken,
      });
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit quiz';
      toast.error(message);
    }
  };

  const handleAssignmentSubmit = async (answer: string) => {
    try {
      await submitAssignmentMutation.mutateAsync({
        courseId,
        assignmentId,
        answer,
      });
      toast.success('Assignment submitted successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit assignment';
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

  // Handle quiz lessons
  if (lesson.type === 'quiz') {
    if (quizLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner className="size-6" />
        </div>
      );
    }

    if (!quizData?.data) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-destructive/10">
          <Lock className="w-12 h-12 text-destructive-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Not Available</h3>
          <p className="text-destructive-primary text-center">
            The quiz for this lesson is not available at this time.
          </p>
        </div>
      );
    }

    const quiz = quizData.data;

    // Show results if quiz is completed
    if (quiz.completed && quiz.submission) {
      return <QuizResults quiz={quiz} />;
    }

    // Show quiz viewer if not completed
    return (
      <QuizViewer
        quiz={quiz}
        courseId={courseId}
        onSubmit={handleQuizSubmit}
        isSubmitting={submitQuizMutation.isPending}
      />
    );
  }

  // Handle assignment lessons
  if (lesson.type === 'assignment') {
    if (assignmentLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner className="size-6" />
        </div>
      );
    }

    if (!assignmentData?.data) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg bg-destructive/10">
          <Lock className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Assignment Not Available</h3>
          <p className="text-destructive text-center">
            The assignment for this lesson is not available at this time.
          </p>
        </div>
      );
    }

    const assignment = assignmentData.data;

    // Show results if assignment is submitted
    if (assignment.submission) {
      return <AssignmentResults assignment={assignment} />;
    }

    // Show assignment viewer if not submitted
    return (
      <AssignmentViewer
        assignment={assignment}
        courseId={courseId}
        onSubmit={handleAssignmentSubmit}
        isSubmitting={submitAssignmentMutation.isPending}
      />
    );
  }

  return null;
};
