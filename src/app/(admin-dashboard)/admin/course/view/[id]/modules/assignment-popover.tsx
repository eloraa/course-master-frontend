'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useAssignmentsList } from '@/data/admin/assignments';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown, FileText, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignmentPopoverProps {
  courseId: string;
  selectedAssignmentId?: string;
  selectedAssignmentTitle?: string;
  onSelect: (assignmentId: string, assignmentTitle: string) => void;
  onClear?: () => void;
}

export const AssignmentPopover = ({
  courseId,
  selectedAssignmentId,
  selectedAssignmentTitle,
  onSelect,
  onClear,
}: AssignmentPopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { data: assignmentsData, isLoading: assignmentsLoading } = useAssignmentsList({
    course: courseId,
    perPage: 100,
  });

  const filteredAssignments = React.useMemo(() => {
    if (!assignmentsData?.data) return [];
    if (!search.trim()) return assignmentsData.data;
    return assignmentsData.data.filter((assignment) =>
      assignment.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [assignmentsData?.data, search]);

  const assignmentCount = assignmentsData?.data?.length || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {selectedAssignmentTitle ? `Assignment: ${selectedAssignmentTitle}` : `Select Assignment (${assignmentCount})`}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <div className="flex items-center border-b relative">
            <CommandInput
              placeholder="Search assignments..."
              value={search}
              onValueChange={setSearch}
              className="border-0 border-b-0 focus:ring-0"
            />
          </div>
          <CommandEmpty>
            {assignmentsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">Loading assignments...</span>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {assignmentsData?.data?.length === 0 ? 'No assignments yet' : 'No assignments found'}
              </div>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem asChild>
              <Link href={`/admin/course/view/${courseId}/assignments/create`}>
                <Plus className="h-4 w-4" />
                Create Assignment
              </Link>
            </CommandItem>
            {filteredAssignments.length > 0 && (
              <div className="my-1 h-px bg-border" />
            )}
            {filteredAssignments.map((assignment) => (
              <CommandItem
                key={assignment.id}
                value={assignment.title}
                onSelect={() => {
                  onSelect(assignment.id, assignment.title);
                  setOpen(false);
                }}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Max score: {assignment.maxScore} • Type: {assignment.type}
                  </p>
                </div>
                <Badge
                  variant={assignment.isPublished ? 'default' : 'secondary'}
                  className="whitespace-nowrap flex-shrink-0 text-xs"
                >
                  {assignment.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
