'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBatchesByCourse } from '@/data/admin/batches';
import { Spinner } from '@/components/ui/spinner';
import { Plus, BookOpen } from 'lucide-react';
import { BatchCreateFilter } from './batch-create-filter';
import { Badge } from '@/components/ui/badge';

interface BatchPopoverProps {
  courseId: string;
}

export const BatchPopover = ({ courseId }: BatchPopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const { data: batchesData, isLoading: batchesLoading } = useBatchesByCourse(courseId);

  const batchCount = batchesData?.data?.length || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Batches {batchCount > 0 && `(${batchCount})`}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex flex-col">
          {/* Header with Create Button */}
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold text-sm">Batches</h4>
            <BatchCreateFilter courseId={courseId} />
          </div>

          {/* Batches List */}
          <ScrollArea className="h-80">
            <div className="p-4">
              {batchesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="h-5 w-5" />
                </div>
              ) : batchesData?.data && batchesData.data.length > 0 ? (
                <div className="space-y-2">
                  {batchesData.data.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-start justify-between gap-3 p-3 border rounded-lg hover:bg-muted transition-colors cursor-default"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{batch.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(batch.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {' • '}
                          {batch.enrolledCount}/{batch.capacity}
                          {' • '}
                          <span className="capitalize">{batch.status}</span>
                        </p>
                      </div>
                      <Badge variant={batch.isPublished ? 'default' : 'secondary'} className="whitespace-nowrap">
                        {batch.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No batches yet</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
