'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type CourseData } from '@/data/admin/courses';
import { CourseActions } from './actions';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { type ExtendedColumnDef } from '@/components/data-table/data-table';
import { Star, Users, BookOpen } from 'lucide-react';

// Status color mapping
const getLevelColor = (level: string | undefined) => {
  if (!level) return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  switch (level.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getPublishStatusColor = (isPublished: boolean) => {
  return isPublished ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
};

// Format level text
const formatLevel = (level: string | undefined) => {
  if (!level) return '-';
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export const columns: ExtendedColumnDef<CourseData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => <div className="max-w-[150px] truncate">{row.getValue('category')}</div>,
  },
  {
    accessorKey: 'level',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
    cell: ({ row }) => {
      const level = row.getValue('level') as string;
      return <Badge className={cn('text-xs', getLevelColor(level))}>{formatLevel(level)}</Badge>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = row.getValue('price');
      const currency = row.original.currency;
      const numPrice = typeof price === 'number' ? price : parseFloat(String(price));
      return (
        <div className="font-medium">
          {currency} {isNaN(numPrice) ? '-' : numPrice.toFixed(2)}
        </div>
      );
    },
  },
  {
    id: 'modules',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Modules" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-muted-foreground" />
        <span>{row.original.moduleStats?.totalModules || 0}</span>
      </div>
    ),
  },
  {
    id: 'lessons',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lessons" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>{row.original.moduleStats?.totalLessons || 0}</span>
      </div>
    ),
  },
  {
    accessorKey: 'totalEnrolled',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Enrolled" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>{row.getValue('totalEnrolled')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'ratingAverage',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
    cell: ({ row }) => {
      const rating = row.getValue('ratingAverage');
      const count = row.original.ratingCount;
      const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating));
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{isNaN(numRating) ? '-' : numRating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">({count})</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') as boolean;
      return <Badge className={cn('text-xs', getPublishStatusColor(isPublished))}>{isPublished ? 'Published' : 'Draft'}</Badge>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return (
        <div className="text-sm">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => <CourseActions course={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
