'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { SomethingWentWrong } from '@/components/error/something-went-wrong/something-went-wrong';

interface SubmissionsViewProps {
  courseId: string;
  assignmentId: string;
}

export const SubmissionsView = ({ courseId, assignmentId }: SubmissionsViewProps) => {
  // Placeholder for now - will implement submissions grading interface later
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/course/view/${courseId}/assignments`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1>Assignment Submissions</h1>
          <p className="text-sm text-muted-foreground">Grade student submissions (Coming Soon)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>Student submission grading interface coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Submission grading interface will be implemented in the next phase.</p>
            <p className="text-sm mt-2">Here you'll be able to review and grade student submissions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
