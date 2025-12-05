'use client';

import { Assignment } from '@/data/student/course-content';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface AssignmentResultsProps {
  assignment: Assignment;
}

export const AssignmentResults = ({ assignment }: AssignmentResultsProps) => {
  const submission = assignment.submission;

  if (!submission) {
    return null;
  }

  const isGraded = submission.reviewed;
  const grade = submission.grade;
  const passed = grade !== null && grade >= assignment.passingScore;
  const percentage = grade !== null ? (grade / assignment.maxScore) * 100 : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Results Summary */}
      <Card className={cn('border-2', isGraded && passed ? 'border-green-200 bg-green-50' : isGraded && !passed ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50')}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{assignment.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Assignment Submitted</p>
            </div>
            {isGraded ? (
              passed ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Passed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-12 h-12 text-red-600" />
                  <span className="text-sm font-semibold text-red-600">Not Passed</span>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="w-12 h-12 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-600">Pending</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grade Display */}
          {isGraded ? (
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-sm font-medium">Your Grade</span>
                <span className="text-3xl font-bold">{grade}/{assignment.maxScore}</span>
              </div>
              <Progress value={percentage} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Passing Score: {assignment.passingScore}%
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Your submission is awaiting grading</p>
              <p className="text-sm text-muted-foreground">The instructor will review your assignment and provide a grade soon.</p>
            </div>
          )}

          {/* Submission Details */}
          <div className="pt-6 border-t space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium">{formatDate(submission.submittedAt)}</span>
            </div>
            {submission.isLate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-destructive font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Late Submission
                </span>
                <span className="font-medium text-destructive">{assignment.latePenalty}% penalty applied</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {isGraded && submission.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownPreview content={submission.feedback} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Content */}
      {submission && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MarkdownPreview content={submission.answer} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
