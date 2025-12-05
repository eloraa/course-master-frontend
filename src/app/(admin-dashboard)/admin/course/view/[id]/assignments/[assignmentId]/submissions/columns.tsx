'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Submission } from '@/data/admin/assignment-submissions';
import { SubmissionActions } from './submission-actions';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { type ExtendedColumnDef } from '@/components/data-table/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const getReviewStatusColor = (reviewed: boolean) => {
  return reviewed ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getColumns = (assignmentId: string): ExtendedColumnDef<Submission>[] => [
  {
    accessorKey: 'user',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Student" />,
    cell: ({ row }) => {
      const user = row.getValue('user') as { name: string; email: string };
      return (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted" />,
    cell: ({ row }) => {
      const date = row.getValue('submittedAt') as string;
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <p className="text-sm cursor-help">{formatDate(date)}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{new Date(date).toUTCString()}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'isLate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isLate = row.getValue('isLate') as boolean;
      return isLate ? (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-600" />
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 text-xs">Late</Badge>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-xs">On Time</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'reviewed',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Review Status" />,
    cell: ({ row }) => {
      const reviewed = row.getValue('reviewed') as boolean;
      const grade = row.original.grade;
      return (
        <div className="flex items-center gap-2">
          {reviewed ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">{grade} pts</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <SubmissionActions submission={row.original} assignmentId={assignmentId} />
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
