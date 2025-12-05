'use client';

import { useState } from 'react';
import { Assignment } from '@/data/student/course-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Clock, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AssignmentViewerProps {
  assignment: Assignment;
  courseId: string;
  onSubmit: (answer: string) => Promise<void>;
  isSubmitting: boolean;
}

export const AssignmentViewer = ({ assignment, courseId, onSubmit, isSubmitting }: AssignmentViewerProps) => {
  const [answer, setAnswer] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmitClick = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer before submitting.');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    await onSubmit(answer);
  };

  const isLate = assignment.dueDate ? new Date() > new Date(assignment.dueDate) : false;
  const isOverdue = assignment.dueDate && new Date() > new Date(assignment.dueDate) && !assignment.allowLateSubmission;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      text: 'Text Submission',
      file: 'File Upload',
      link: 'Link Submission',
      code: 'Code Submission',
    };
    return labels[assignment.type] || assignment.type;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Assignment Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{assignment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignment.description && <p className="text-sm text-muted-foreground">{assignment.description}</p>}

          {/* Assignment Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t">
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-semibold">{getTypeLabel()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Max Score</p>
              <p className="font-semibold">{assignment.maxScore}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Passing Score</p>
              <p className="font-semibold">{assignment.passingScore}%</p>
            </div>
            {assignment.dueDate && (
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Due Date
                </p>
                <p className="font-semibold text-xs">{formatDate(assignment.dueDate)}</p>
              </div>
            )}
          </div>

          {/* Status Alerts */}
          {isOverdue && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>This assignment is overdue. Submissions are no longer accepted.</AlertDescription>
            </Alert>
          )}

          {isLate && !isOverdue && assignment.allowLateSubmission && (
            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                This submission will be marked as late. A {assignment.latePenalty}% penalty will be applied.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      {assignment.instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{assignment.instructions}</p>
          </CardContent>
        </Card>
      )}

      {/* Resources/Attachments */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {assignment.attachments.map((attachment, index) => (
                <li key={index}>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <Download className="w-4 h-4" />
                    {attachment.name}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Answer Input */}
      {!isOverdue && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-32"
              disabled={isSubmitting}
            />
            <div className="text-xs text-muted-foreground">
              {answer.length} characters
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {!isOverdue && (
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            onClick={handleSubmitClick}
            disabled={isSubmitting || !answer.trim()}
            size="lg"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="md:max-w-md pt-6">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>Are you sure you want to submit your assignment?</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-semibold">Assignment:</span> {assignment.title}
            </p>
            {isLate && assignment.allowLateSubmission && (
              <p className="text-sm text-destructive">
                <span className="font-semibold">Warning:</span> This submission will be marked as late. A {assignment.latePenalty}% penalty will be applied.
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Once submitted, you cannot change your answer unless you resubmit.
            </p>
          </div>
          <DialogFooter className="flex max-md:flex-col max-md:items-end max-md:space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="max-md:w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="max-md:w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
