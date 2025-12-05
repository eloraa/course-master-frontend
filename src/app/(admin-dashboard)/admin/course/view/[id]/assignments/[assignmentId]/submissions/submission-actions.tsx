'use client';

import { Submission } from '@/data/admin/assignment-submissions';
import { GradeSubmissionDialog } from './grade-submission-dialog';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, MessageSquare } from 'lucide-react';

interface SubmissionActionsProps {
  submission: Submission;
  assignmentId: string;
}

export const SubmissionActions = ({ submission, assignmentId }: SubmissionActionsProps) => {
  const [showGradeDialog, setShowGradeDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowGradeDialog(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>{submission.reviewed ? 'Update Grade' : 'Grade Submission'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GradeSubmissionDialog
        open={showGradeDialog}
        onOpenChange={setShowGradeDialog}
        submission={submission}
        assignmentId={assignmentId}
      />
    </>
  );
};
