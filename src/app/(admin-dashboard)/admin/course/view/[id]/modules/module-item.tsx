'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { GripVertical, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleActions } from './module-actions';
import type { Module } from '@/data/admin/modules';

interface ModuleItemProps {
  module: Module;
  index: number;
  isDragging: boolean;
  draggedOver: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onEdit: (module: Module) => void;
}

export const ModuleItem = React.forwardRef<HTMLDivElement, ModuleItemProps>(
  (
    {
      module,
      isDragging,
      draggedOver,
      onDragStart,
      onDragOver,
      onDragEnd,
      isOpen,
      onOpenChange,
      onEdit,
    },
    ref
  ) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
      onDragStart(0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      onDragOver(0);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDragEnd();
    };

    return (
      <Card
        ref={ref}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        className={cn('transition-all', {
          'opacity-50 cursor-grabbing': isDragging,
          'border-primary ring-2 ring-primary/20': draggedOver,
          'hover:shadow-md': !isDragging,
        })}
      >
        <Collapsible open={isOpen} onOpenChange={onOpenChange}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              {/* Drag Handle */}
              <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Expand Icon */}
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform flex-shrink-0',
                  isOpen && 'rotate-90'
                )}
              />

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{module.title}</h3>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    #{module.order + 1}
                  </Badge>
                  {module.isPublished ? (
                    <Badge variant="default" className="text-xs flex-shrink-0 bg-green-100 text-green-800 hover:bg-green-200">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Draft
                    </Badge>
                  )}
                </div>
                {module.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {module.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {module.lessonCount} lesson{module.lessonCount !== 1 ? 's' : ''}
                  </span>
                  {module.updatedAt && (
                    <span>
                      Updated {new Date(module.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <ModuleActions module={module} onEdit={onEdit} courseId={module.course} />
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <Separator />
            <div className="p-4">
              <Card className="border-dashed bg-muted/10">
                <div className="p-8 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Lessons will be displayed here
                  </p>
                </div>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }
);

ModuleItem.displayName = 'ModuleItem';
