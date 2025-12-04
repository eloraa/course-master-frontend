'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Quiz } from '@/data/admin/quizzes';
import { QuizActions } from './quiz-actions';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { type ExtendedColumnDef } from '@/components/data-table/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, HelpCircle, Target } from 'lucide-react';

const getPublishStatusColor = (isPublished: boolean) => {
  return isPublished ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
};

export const getColumns = (courseId: string): ExtendedColumnDef<Quiz>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="font-medium truncate max-w-xs cursor-help">
              <span className="border-b border-dotted border-brand-saffron-primary/50">{title}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{title}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'questionCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Questions" />,
    cell: ({ row }) => {
      const count = row.getValue('questionCount') as number;
      return (
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalPoints',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Points" />,
    cell: ({ row }) => {
      const points = row.getValue('totalPoints') as number;
      return (
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span>{points}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'timeLimit',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time Limit" />,
    cell: ({ row }) => {
      const timeLimit = row.getValue('timeLimit') as number | undefined;
      if (!timeLimit) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{timeLimit}m</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') as boolean;
      return (
        <Badge className={cn('text-xs', getPublishStatusColor(isPublished))}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <QuizActions quiz={row.original} courseId={courseId} />,
    enableSorting: false,
    enableHiding: false,
  },
];
