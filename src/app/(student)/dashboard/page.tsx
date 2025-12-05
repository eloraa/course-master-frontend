import { EnrolledCoursesList } from './enrolled-courses-list';

export default function DashboardPage() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground mt-2">Track your progress and continue learning</p>
        </div>
        <EnrolledCoursesList />
      </div>
    </main>
  );
}
