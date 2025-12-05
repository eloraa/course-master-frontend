'use client';

import { useState } from 'react';
import { Submission } from '@/data/admin/assignment-submissions';
import { useGradeSubmission } from '@/data/admin/assignment-submissions';
import { MarkdownPreview } from '@/components/markdown/markdown';
import { CustomMarkdownEditor } from '@/components/markdown/custom-markdown-editor';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface GradeSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission;
  assignmentId: string;
}

export const GradeSubmissionDialog = ({
  open,
  onOpenChange,
  submission,
  assignmentId,
}: GradeSubmissionDialogProps) => {
  const [grade, setGrade] = useState<string>(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState<string>(submission.feedback || '');
  const gradeSubmissionMutation = useGradeSubmission();

  const handleGrade = async () => {
    if (!grade || isNaN(Number(grade))) {
      toast.error('Please enter a valid grade');
      return;
    }

    try {
      await gradeSubmissionMutation.mutateAsync({
        assignmentId,
        submissionId: submission.id,
        payload: {
          grade: Number(grade),
          feedback: feedback || undefined,
        },
      });

      toast.success('Submission graded successfully!');
      onOpenChange(false);
      setGrade('');
      setFeedback('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to grade submission';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Student: {submission.user.name} ({submission.user.email})
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="submission" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submission">Submission</TabsTrigger>
            <TabsTrigger value="grade">Grade & Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="submission" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Student Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <MarkdownPreview content={submission.answer} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  type="number"
                  placeholder="Enter grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  disabled={gradeSubmissionMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <CustomMarkdownEditor
                  value={feedback}
                  onChange={setFeedback}
                  placeholder="Enter feedback..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={gradeSubmissionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGrade}
            disabled={gradeSubmissionMutation.isPending || !grade}
          >
            {gradeSubmissionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {gradeSubmissionMutation.isPending ? 'Grading...' : 'Submit Grade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
