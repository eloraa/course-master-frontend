'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Assignment } from '@/data/admin/assignments';
import { AssignmentActions } from './assignment-actions';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { type ExtendedColumnDef } from '@/components/data-table/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, BookOpen, Link as LinkIcon } from 'lucide-react';

const getPublishStatusColor = (isPublished: boolean) => {
  return isPublished ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'text':
      return <FileText className="h-4 w-4" />;
    case 'file':
      return <FileText className="h-4 w-4" />;
    case 'code':
      return <FileText className="h-4 w-4" />;
    case 'link':
      return <LinkIcon className="h-4 w-4" />;
    default:
      return <BookOpen className="h-4 w-4" />;
  }
};

export const getColumns = (courseId: string): ExtendedColumnDef<Assignment>[] => [
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
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <span className="capitalize">{type}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'maxScore',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Max Score" />,
    cell: ({ row }) => {
      const score = row.getValue('maxScore') as number;
      return <span>{score}</span>;
    },
  },
  {
    accessorKey: 'submissionCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submissions" />,
    cell: ({ row }) => {
      const count = row.getValue('submissionCount') as number;
      return <span>{count}</span>;
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
    cell: ({ row }) => <AssignmentActions assignment={row.original} courseId={courseId} />,
    enableSorting: false,
    enableHiding: false,
  },
];
