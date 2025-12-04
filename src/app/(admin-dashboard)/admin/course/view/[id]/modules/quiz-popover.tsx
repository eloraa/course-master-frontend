'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { useQuizzesList } from '@/data/admin/quizzes';
import { Spinner } from '@/components/ui/spinner';
import { Plus, BarChart3, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuizPopoverProps {
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  onSelect: (quizId: string) => void;
}

export const QuizPopover = ({ courseId, moduleId, lessonId, onSelect }: QuizPopoverProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const { data: quizzesData, isLoading: quizzesLoading } = useQuizzesList({
    course: courseId,
    ...(moduleId && { module: moduleId }),
    ...(lessonId && { lesson: lessonId }),
  });

  const filteredQuizzes = React.useMemo(() => {
    if (!quizzesData?.data) return [];
    if (!search.trim()) return quizzesData.data;
    return quizzesData.data.filter((quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [quizzesData?.data, search]);

  const quizCount = quizzesData?.data?.length || 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-between">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="truncate">Quizzes {quizCount > 0 && `(${quizCount})`}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <div className="flex items-center border-b relative">
            <CommandInput
              placeholder="Search quizzes..."
              value={search}
              onValueChange={setSearch}
              className="border-0 border-b-0 focus:ring-0"
            />
          </div>
          <CommandEmpty>
            {quizzesLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">Loading quizzes...</span>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                {quizzesData?.data?.length === 0 ? 'No quizzes yet' : 'No quizzes found'}
              </div>
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandItem asChild>
              <Link href={`/admin/course/view/${courseId}/quiz`}>
                <Plus className="h-4 w-4" />
                Create Quiz
              </Link>
            </CommandItem>
            {filteredQuizzes.length > 0 && (
              <div className="my-1 h-px bg-border" />
            )}
            {filteredQuizzes.map((quiz) => (
              <CommandItem
                key={quiz.id}
                value={quiz.title}
                onSelect={() => {
                  onSelect(quiz.id);
                  setOpen(false);
                }}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{quiz.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
                    {' • '}
                    {quiz.totalPoints} point{quiz.totalPoints !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge
                  variant={quiz.isPublished ? 'default' : 'secondary'}
                  className="whitespace-nowrap flex-shrink-0 text-xs"
                >
                  {quiz.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
