'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { BookOpen, ChevronsUpDown, Plus } from 'lucide-react';
import { useBatchesByCourse } from '@/data/admin/batches';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { BatchCreateFilter } from './batch-create-filter';
import { BatchDetailsDialog } from './batch-details-dialog';

interface BatchSelectorProps {
  courseId: string;
}

export const BatchSelector = ({ courseId }: BatchSelectorProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [selectedBatchId, setSelectedBatchId] = React.useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = React.useState(false);
  const { data: batchesData, isLoading: batchesLoading } = useBatchesByCourse(courseId);

  const filteredBatches = React.useMemo(() => {
    if (!batchesData?.data) return [];
    if (!search.trim()) return batchesData.data;
    return batchesData.data.filter((batch) =>
      batch.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [batchesData?.data, search]);

  const batchCount = batchesData?.data?.length || 0;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-between">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <BookOpen className="h-4 w-4 shrink-0" />
              <span className="truncate">Batches {batchCount > 0 && `(${batchCount})`}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80" align="start">
          <Command>
            <div className="flex items-center border-b relative">
              <CommandInput
                placeholder="Search batches..."
                value={search}
                onValueChange={setSearch}
                className="border-0 border-b-0 focus:ring-0"
              />
            </div>
            <CommandEmpty>
              {batchesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner className="h-4 w-4 mr-2" />
                  <span className="text-sm text-muted-foreground">Loading batches...</span>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  {batchesData?.data?.length === 0 ? 'No batches yet' : 'No batches found'}
                </div>
              )}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              <CommandItem
                onSelect={() => {
                  setShowCreateDialog(true);
                  setOpen(false);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Batch
              </CommandItem>
              {filteredBatches.length > 0 && (
                <div className="my-1 h-px bg-border" />
              )}
              {filteredBatches.map((batch) => (
                <CommandItem
                  key={batch.id}
                  value={batch.name}
                  onSelect={() => {
                    setSelectedBatchId(batch.id);
                    setShowDetailsDialog(true);
                    setOpen(false);
                  }}
                  className="flex items-start justify-between gap-2 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(batch.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {batch.endDate && (
                        <>
                          {' - '}
                          {new Date(batch.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Create Batch Dialog */}
      <BatchCreateFilter
        courseId={courseId}
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {/* Batch Details Dialog */}
      <BatchDetailsDialog
        batchId={selectedBatchId}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        courseId={courseId}
      />
    </>
  );
};
