'use client';

import { useState } from 'react';
import { useCourseModules, useModuleLessons, type Module } from '@/data/student/course-content';
import { Spinner } from '@/components/ui/spinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, PlayCircle, FileText, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ModuleSidebarProps {
  courseId: string;
  courseSlug: string;
  currentLessonId?: string;
}

export const ModuleSidebar = ({ courseId, courseSlug, currentLessonId }: ModuleSidebarProps) => {
  const { data: modulesData, isLoading, error } = useCourseModules(courseId);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-sm text-destructive-primary">Failed to load modules</div>;
  }

  const modules = modulesData?.data || [];

  return (
    <div className="flex flex-col gap-2">
      {modules.map(module => (
        <ModuleItem
          key={module.id}
          module={module}
          courseId={courseId}
          courseSlug={courseSlug}
          isOpen={openModules.has(module.id)}
          onToggle={() => toggleModule(module.id)}
          currentLessonId={currentLessonId}
        />
      ))}
    </div>
  );
};

interface ModuleItemProps {
  module: Module;
  courseId: string;
  courseSlug: string;
  isOpen: boolean;
  onToggle: () => void;
  currentLessonId?: string;
}

const ModuleItem = ({ module, courseId, courseSlug, isOpen, onToggle, currentLessonId }: ModuleItemProps) => {
  // Only fetch lessons when module is open
  const { data: lessonsData, isLoading } = useModuleLessons(courseId, module.id, isOpen);

  const lessons = lessonsData?.data || [];

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent rounded-md transition-colors group">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />}
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <span className="font-medium text-sm line-clamp-2 text-left">{module.title}</span>
            <span className="text-xs text-muted-foreground">
              {module.lessonCount} {module.lessonCount === 1 ? 'lesson' : 'lessons'}
            </span>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Spinner className="size-4" />
          </div>
        ) : (
          <div className="ml-6 mt-1 space-y-1">
            {lessons.map(lesson => {
              const isActive = currentLessonId === lesson.id;
              const isQuizOrAssignment = lesson.type === 'quiz' || lesson.type === 'assignment';

              if (isQuizOrAssignment) {
                return (
                  <div key={lesson.id} className="flex items-center gap-2 w-full p-2 rounded-md opacity-50 cursor-not-allowed">
                    <LessonIcon type={lesson.type} isActive={false} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-sm line-clamp-2">{lesson.title}</span>
                      {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration} min</span>}
                    </div>
                    <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>
                );
              }

              return (
                <Link
                  key={lesson.id}
                  href={`/dashboard/${courseSlug}/${lesson.id}`}
                  className={cn('flex items-center gap-2 w-full p-2 rounded-md transition-colors text-left group', isActive ? 'bg-primary/10 text-primary' : 'hover:bg-accent')}
                >
                  <LessonIcon type={lesson.type} isActive={isActive} />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm line-clamp-2">{lesson.title}</span>
                    {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration} min</span>}
                  </div>
                  {lesson.completed && <CheckCircle2 className="w-3 h-3 text-green-600 shrink-0" />}
                </Link>
              );
            })}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

const LessonIcon = ({ type, isActive }: { type: string; isActive: boolean }) => {
  const className = cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground');

  switch (type) {
    case 'video':
      return <PlayCircle className={className} />;
    case 'article':
      return <FileText className={className} />;
    case 'quiz':
      return <CheckCircle2 className={className} />;
    case 'assignment':
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
};
