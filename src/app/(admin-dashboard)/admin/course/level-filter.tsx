'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface LevelFilterProps {
  level?: 'beginner' | 'intermediate' | 'advanced';
  onChange?: (level: 'beginner' | 'intermediate' | 'advanced' | undefined) => void;
}

export const LevelFilter = ({ level, onChange }: LevelFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Level
          {level && <span className="text-xs font-semibold">{level}</span>}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={level === 'beginner'} onCheckedChange={() => onChange && onChange(level === 'beginner' ? undefined : 'beginner')}>
          Beginner
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={level === 'intermediate'} onCheckedChange={() => onChange && onChange(level === 'intermediate' ? undefined : 'intermediate')}>
          Intermediate
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={level === 'advanced'} onCheckedChange={() => onChange && onChange(level === 'advanced' ? undefined : 'advanced')}>
          Advanced
        </DropdownMenuCheckboxItem>
        {level && (
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
