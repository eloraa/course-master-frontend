'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useModulesList, updateModule } from '@/data/admin/modules';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ModuleItem } from './module-item';
import { ModuleFormDialog } from './module-form-dialog';
import type { Module } from '@/data/admin/modules';

interface ModulesViewProps {
  courseId: string;
}

export const ModulesView = ({ courseId }: ModulesViewProps) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useModulesList({ course: courseId });

  // Initialize modules from query data
  useEffect(() => {
    if (data?.data) {
      const sorted = [...data.data].sort((a, b) => a.order - b.order);
      setModules(sorted);
    }
  }, [data]);

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...modules];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, removed);

    setModules(reordered);
    setDraggedIndex(index);
    setDraggedOverIndex(index);
  };

  const updateModuleOrderMutation = useMutation({
    mutationFn: async (modulesToUpdate: Module[]) => {
      await Promise.all(
        modulesToUpdate.map((module, idx) =>
          updateModule(module.id, { order: idx })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules-list'] });
      toast.success('Module order updated successfully');
    },
    onError: () => {
      // Revert to original order
      if (data?.data) {
        const sorted = [...data.data].sort((a, b) => a.order - b.order);
        setModules(sorted);
      }
      toast.error('Failed to update module order');
    },
  });

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    setDraggedIndex(null);
    setDraggedOverIndex(null);

    // Persist to backend
    await updateModuleOrderMutation.mutateAsync(modules);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setShowFormDialog(true);
  };

  const handleCreateModule = () => {
    setEditingModule(null);
    setShowFormDialog(true);
  };

  const handleFormDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowFormDialog(false);
      setEditingModule(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive-primary" />
          <div>
            <h3 className="font-semibold">Failed to load modules</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Course Modules</h2>
          <p className="text-muted-foreground text-sm">
            {modules.length} module{modules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleCreateModule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">No modules yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first module to get started
              </p>
            </div>
            <Button onClick={handleCreateModule} variant="outline">
              Create Module
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              module={module}
              courseId={courseId}
              index={index}
              isDragging={draggedIndex === index}
              draggedOver={draggedOverIndex === index}
              onDragStart={() => handleDragStart(index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              isOpen={openModuleId === module.id}
              onOpenChange={(isOpen) => setOpenModuleId(isOpen ? module.id : null)}
              onEdit={handleEditModule}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ModuleFormDialog
        open={showFormDialog}
        onOpenChange={handleFormDialogClose}
        module={editingModule}
        courseId={courseId}
        nextOrder={modules.length}
      />
    </>
  );
};
