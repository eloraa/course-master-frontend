'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { CoursesList } from './courses-list';

export const Courses = () => {
  return (
    <main className="space-y-6">
      <div className="flex items-center gap-4 max-md:justify-between">
        <h1>Courses</h1>
        <Button size="sm" variant="default" asChild>
          <Link href="/admin/course/create">
            <PlusIcon className="h-4 w-4" />
            Create Course
          </Link>
        </Button>
      </div>

      <CoursesList />
    </main>
  );
};
