'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useModulesList } from '@/data/admin/modules';
import { Spinner } from '@/components/ui/spinner';
import { ChevronsUpDown, BookOpen, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModulePopoverProps {
  courseId: string;
  selectedModuleId?: string;
  selectedModuleTitle?: string;
  onSelect: (moduleId: string, moduleTitle: string) => void;
  onClear?: () => void;
}

export const ModulePopover = ({
  courseId,
  selectedModuleId,
  selectedModuleTitle,
  onSelect,
  onClear,
}: ModulePopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { data: modulesData, isLoading: modulesLoading } = useModulesList({
    course: courseId,
    perPage: 100,
  });

  const filteredModules = React.useMemo(() => {
    if (!modulesData?.data) return [];
    if (!search.trim()) return modulesData.data;
    return modulesData.data.filter((module) =>
      module.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [modulesData?.data, search]);

  const moduleCount = modulesData?.data?.length || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {selectedModuleTitle ? `Module: ${selectedModuleTitle}` : `Select Module (${moduleCount})`}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <div className="flex items-center border-b relative">
            <CommandInput
              placeholder="Search modules..."
              value={search}
              onValueChange={setSearch}
              className="border-0 border-b-0 focus:ring-0"
            />
          </div>
          <CommandEmpty>
            {modulesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">Loading modules...</span>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {modulesData?.data?.length === 0 ? 'No modules yet' : 'No modules found'}
              </div>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredModules.map((module) => (
              <CommandItem
                key={module.id}
                value={module.title}
                onSelect={() => {
                  onSelect(module.id, module.title);
                  setOpen(false);
                }}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{module.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.lessonCount} lesson{module.lessonCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge
                  variant={module.isPublished ? 'default' : 'secondary'}
                  className="whitespace-nowrap flex-shrink-0 text-xs"
                >
                  {module.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
