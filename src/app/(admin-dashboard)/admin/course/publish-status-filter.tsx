'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface PublishStatusFilterProps {
  isPublished?: boolean;
  onChange?: (status: boolean | undefined) => void;
}

export const PublishStatusFilter = ({ isPublished, onChange }: PublishStatusFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Status
          {isPublished !== undefined && <span className="text-xs font-semibold">{isPublished ? 'Published' : 'Draft'}</span>}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={isPublished === true} onCheckedChange={() => onChange && onChange(isPublished === true ? undefined : true)}>
          Published
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={isPublished === false} onCheckedChange={() => onChange && onChange(isPublished === false ? undefined : false)}>
          Draft
        </DropdownMenuCheckboxItem>
        {isPublished !== undefined && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={() => onChange && onChange(undefined)}>
              Clear Filter
            </DropdownMenuCheckboxItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
